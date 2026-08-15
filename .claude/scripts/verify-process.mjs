#!/usr/bin/env node
/*
 * verify:process — CLAUDE.md 목적 3(구현 프로세스 표준화)의 판정 스크립트.
 *
 * 컴포넌트 1개가 "완료"이려면 산출물 4개가 모두 있어야 한다. 이 스크립트는
 * src/components 아래의 컴포넌트마다 그 4개를 확인해 표로 출력하고,
 * 하나라도 미충족이면 exit 1 을 낸다.
 *
 *   1 Figma 원본 참조   구현체에 node-id 를 가진 figma.com 링크, 또는 Code Connect 매핑 파일
 *   2 토큰 매핑         "토큰 매핑" 기록 + 토큰 이름 참조가 같은 파일에 함께 존재
 *   3 구현체            X.tsx 가 파일명과 같은 이름의 값을 export 한다
 *   4 Story             X.stories.tsx 에 parameters.design(type figma + url) 이 있고
 *                       autodocs 가 유효하다
 *
 * 1 과 3 은 각자 독립적으로 실패할 수 있어야 한다. 1 을 story 링크로도 충족시키면
 * 4 번에 흡수되고, 3 을 "무언가를 export 한다"로 두면 .tsx 는 타입 하나만 내보내도
 * 통과해서 두 칸 모두 아무것도 걸러내지 못한다. 4 개를 따로 세는 의미가 사라진다.
 *
 * 1·2 는 원본 링크와 대응표가 "기록됐는지"를 보는 검사다. 기록의 존재만 판정하며
 * 표의 내용이 실제 Figma 와 맞는지는 판정하지 못한다 — 그것은 design-reviewer 의
 * 몫이다. 이 스크립트를 통과했다는 것이 매핑이 정확하다는 뜻은 아니다.
 *
 * autodocs 는 .storybook/preview.ts 가 tags 로 전역 opt-in 해 두었기 때문에
 * 개별 story 에 'autodocs' 문자열이 없어도 유효하다. 전역 설정을 읽지 않고
 * story 파일만 보면 멀쩡한 컴포넌트를 미충족으로 오탐한다.
 *
 * 사용법: node .claude/scripts/verify-process.mjs   (= npm run verify:process)
 */

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { basename, join, relative } from 'node:path'

const COMPONENT_ROOT = 'src/components'
const PREVIEW_CONFIG = '.storybook/preview.ts'

/* node-id 가 붙은 Figma 링크만 원본 참조로 인정한다. 파일 링크만으로는 어느
 * 노드를 옮긴 것인지 되짚을 수 없다. */
const FIGMA_NODE_LINK = /figma\.com\/design\/[^\s'"`)]*node-id=\d+[-:]\d+/
const TOKEN_MAP_HEADING = /(토큰|token)\s*매핑/i
const TOKEN_NAME = /--[a-z][a-z0-9-]*/

/* 구현체는 "무언가를 export 한다"로는 판정되지 않는다. .tsx 는 타입 하나만
 * 내보내도 그 조건을 통과하므로, 그렇게 두면 3 번 칸은 발견된 모든 파일에서
 * 항상 충족이 되어 아무것도 걸러내지 못한다. 파일명과 같은 이름의 *값*을
 * 내보내는지 본다 — 저장소의 컴포넌트는 전부 `export function <파일명>` 이고,
 * 타입만 있는 모듈은 애초에 .ts 로 두는 것이 이 저장소의 관례다. */
function exportsComponent(source, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const declared = new RegExp(
    `export\\s+(?:async\\s+)?(?:function|const|let|class)\\s+${escaped}\\b`,
  )
  const listed = new RegExp(`export\\s*\\{[^}]*\\b${escaped}\\b[^}]*\\}`)
  const asDefault = new RegExp(`export\\s+default\\s+(?:async\\s+)?function\\s+${escaped}\\b`)
  return declared.test(source) || listed.test(source) || asDefault.test(source)
}
/* parameters.design 은 addon-designs 계약이다. url 값이 리터럴이든 상수
 * 참조든 받아들이고, figma 링크 자체는 산출물 1 에서 따로 확인한다. */
const DESIGN_PARAM = /design\s*:\s*\{[^{}]*type\s*:\s*['"]figma['"][^{}]*url\s*:/
const AUTODOCS_OPT_IN = /tags\s*:\s*\[[^\]]*['"]autodocs['"]/
const AUTODOCS_OPT_OUT = /tags\s*:\s*\[[^\]]*['"]!autodocs['"]/

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) walk(full, files)
    else files.push(full)
  }
  return files
}

function read(path) {
  return existsSync(path) ? readFileSync(path, 'utf8') : null
}

/* autodocs 판정에만 쓴다. preview.ts 의 주석은 "끄려면 tags: ['!autodocs'] 를
 * 쓰라"는 사용법 안내를 담고 있어서, 주석을 지우지 않으면 안내문이 실제 opt-out
 * 으로 오인된다. 링크의 // 를 주석 시작으로 잘못 보지 않도록 :// 는 남긴다. */
function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/(^|[^:])\/\/[^\n]*/g, '$1')
}

/* preview.ts 가 tags 로 전역 autodocs 를 켰는지 본다. 켜져 있으면 개별 story 는
 * opt-out 하지 않는 한 자동으로 autodocs 페이지를 갖는다. */
function globalAutodocsEnabled() {
  const preview = read(PREVIEW_CONFIG)
  if (preview === null) return false
  const code = stripComments(preview)
  return AUTODOCS_OPT_IN.test(code) && !AUTODOCS_OPT_OUT.test(code)
}

function collectComponents() {
  if (!existsSync(COMPONENT_ROOT)) return []
  return walk(COMPONENT_ROOT)
    .filter((f) => f.endsWith('.tsx') && !f.endsWith('.stories.tsx'))
    .filter((f) => !f.endsWith('.figma.tsx'))
    .sort()
}

function checkComponent(implPath, { globalAutodocs }) {
  const base = implPath.slice(0, -'.tsx'.length)
  const storyPath = `${base}.stories.tsx`
  const impl = read(implPath)
  const story = read(storyPath)
  const codeConnect =
    existsSync(`${base}.figma.tsx`) || existsSync(`${base}.figma.ts`)

  const sources = [impl, story].filter((s) => s !== null)
  const reasons = []

  /* 1 — Figma 원본 참조. 구현체(또는 Code Connect)에서 찾는다. story 의 링크로도
   * 충족시키면 이 칸이 4 번에 흡수된다 — 4 번이 이미 parameters.design 의 figma
   * 링크를 요구하므로, story 를 인정하는 순간 1 번은 "story 가 없을 때"에만
   * 실패하는 종속 칸이 된다. 두 산출물이 각자 실패할 수 있어야 4 개를 따로 세는
   * 의미가 있다. */
  const figmaRef = codeConnect || (impl !== null && FIGMA_NODE_LINK.test(impl))
  if (!figmaRef) {
    reasons.push(
      'Figma 참조 없음 — node-id 가 붙은 figma.com 링크를 구현체 주석에 남기거나 Code Connect 매핑을 추가할 것',
    )
  }

  /* 2 — 토큰 매핑. 표기와 토큰 이름이 같은 파일에 함께 있어야 한다. 둘 중
   * 하나만으로는 대응표가 아니라 지나가는 언급일 수 있다. */
  const tokenMap = sources.some(
    (s) => TOKEN_MAP_HEADING.test(s) && TOKEN_NAME.test(s),
  )
  if (!tokenMap) {
    reasons.push(
      '토큰 매핑 없음 — Figma 변수 → 코드 토큰 대응을 구현체 주석이나 story docs 에 적을 것',
    )
  }

  /* 3 — 구현체 */
  const componentName = basename(implPath, '.tsx')
  const implementation = impl !== null && exportsComponent(impl, componentName)
  if (impl === null) reasons.push('구현체 없음')
  else if (!implementation) {
    reasons.push(
      `구현체 없음 — 파일명과 같은 이름을 named export 할 것 (export function ${componentName}). 컴포넌트가 아닌 모듈이면 .ts 로 둘 것`,
    )
  }

  /* 4 — Story */
  let storyOk = false
  if (story === null) {
    reasons.push(`Story 없음 — ${relative('.', storyPath)} 를 만들 것`)
  } else {
    const storyCode = stripComments(story)
    const hasDesign = DESIGN_PARAM.test(storyCode)
    const optedOut = AUTODOCS_OPT_OUT.test(storyCode)
    const autodocs = optedOut
      ? false
      : globalAutodocs || AUTODOCS_OPT_IN.test(storyCode)

    if (!hasDesign) {
      reasons.push(
        "Story 에 parameters.design 없음 — { type: 'figma', url: … } 을 연결할 것",
      )
    }
    if (!autodocs) {
      reasons.push(
        optedOut
          ? "Story 가 '!autodocs' 로 autodocs 를 껐음"
          : "autodocs 없음 — preview.ts 전역 설정이 꺼져 있고 story 에도 tags: ['autodocs'] 가 없음",
      )
    }
    storyOk = hasDesign && autodocs
  }

  return {
    name: relative(COMPONENT_ROOT, implPath).slice(0, -'.tsx'.length),
    figmaRef,
    tokenMap,
    implementation,
    story: storyOk,
    reasons,
  }
}

function main() {
  const components = collectComponents()

  if (components.length === 0) {
    console.error(
      `\n${COMPONENT_ROOT} 에서 컴포넌트를 찾지 못했습니다. 경로를 확인하세요.\n`,
    )
    process.exit(1)
  }

  const globalAutodocs = globalAutodocsEnabled()
  const results = components.map((f) => checkComponent(f, { globalAutodocs }))
  const nameWidth = Math.max(9, ...results.map((r) => r.name.length))
  /* 체크 문자는 터미널에서 2칸을 차지하므로 헤더 폭(7)에서 2를 뺀 만큼만 채운다. */
  const mark = (ok) => `  ${ok ? '✅' : '❌'}   `

  console.log(
    `\n목적 3 — 컴포넌트별 산출물 4단계 (autodocs 전역 설정: ${
      globalAutodocs ? 'on' : 'off'
    })\n`,
  )
  console.log(
    `${'컴포넌트'.padEnd(nameWidth)}  1 Figma  2 토큰  3 구현  4 Story`,
  )
  console.log('-'.repeat(nameWidth + 34))

  for (const r of results) {
    console.log(
      r.name.padEnd(nameWidth) +
        mark(r.figmaRef) +
        ' ' +
        mark(r.tokenMap) +
        ' ' +
        mark(r.implementation) +
        ' ' +
        mark(r.story),
    )
  }

  const failed = results.filter((r) => r.reasons.length > 0)

  if (failed.length > 0) {
    console.error(`\n미충족 ${failed.length}개 — 3/4 는 완료가 아닙니다.\n`)
    for (const r of failed) {
      console.error(`  ${r.name}`)
      for (const reason of r.reasons) console.error(`    - ${reason}`)
    }
    console.error('')
    process.exit(1)
  }

  console.log(
    `\n✓ ${results.length}개 컴포넌트 모두 산출물 4개 충족 (목적 3 pass)`,
  )
  console.log(
    '  주의: 이 검사는 기록의 존재만 봅니다. 매핑 내용의 정확성은 design-reviewer 가 판정합니다.\n',
  )
  process.exit(0)
}

main()
