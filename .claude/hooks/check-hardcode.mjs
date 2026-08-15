#!/usr/bin/env node
/**
 * Layer 3 of the enforcement contract in CLAUDE.md: hard-block hardcoded visual
 * values at the tool level, before they ever reach a file.
 *
 * Two modes:
 *   (stdin)  PreToolUse hook. Reads the tool call as JSON, scans the content it
 *            would write, and exits 2 to block when a violation is found.
 *   --scan   Walks src/ and reports every violation. Exits 1 if any. Used by
 *            `npm run verify:tokens`.
 *
 * Zero dependencies — node built-ins only.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { basename, extname, join, relative } from 'node:path'

const TARGET_EXTENSIONS = new Set(['.tsx', '.jsx', '.ts', '.js', '.css'])
const SCAN_ROOT = 'src'

/** Files that define tokens are the one place raw values are allowed. */
function isExemptFile(filePath) {
  const name = basename(filePath)
  return name === 'design-tokens.css' || name.endsWith('.tokens.css')
}

/**
 * A line opts out with a trailing `token-exempt: <reason>`. The reason is
 * mandatory: comment terminators and punctuation do not count as one, so
 * `/* token-exempt: *\/` is still blocked.
 */
function isExemptLine(line) {
  const match = /token-exempt:(.*)$/.exec(line)
  if (!match) return false

  const reason = match[1]
    .replace(/\*\//g, ' ')
    .replace(/-->/g, ' ')
    .replace(/[{};]/g, ' ')
    .trim()

  return reason.length >= 3 && /[\p{L}\p{N}]/u.test(reason)
}

const RULES = [
  {
    kind: 'hex',
    // #rgb #rgba #rrggbb #rrggbbaa
    pattern:
      /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})(?![0-9a-fA-F])/g,
    suggest: () =>
      'var(--color-…) 또는 bg-/text-/border- 토큰 유틸리티 (src/tokens/design-tokens.css)',
  },
  {
    kind: 'color-function',
    pattern: /\b(?:rgba?|hsla?)\s*\(/gi,
    suggest: () => 'var(--color-…) — 색상 함수 리터럴 대신 색상 토큰',
  },
  {
    kind: 'raw-px',
    pattern: /(?<![\w-])\d*\.?\d+px\b/g,
    suggest: (value) =>
      `--spacing-* / --radius-* / --text-* 토큰 (${value} 에 해당하는 스텝을 src/tokens/ 에서 찾거나 추가)`,
  },
  {
    kind: 'arbitrary-tailwind',
    pattern: /(?:^|[\s"'`{])((?:[a-z][a-z0-9]*:)*[a-z][a-z0-9-]*-\[[^\]\s]+\])/g,
    captureGroup: 1,
    suggest: (value) => {
      const utility = value.replace(/^(?:[a-z][a-z0-9]*:)*/, '').split('-[')[0]
      if (/^(?:bg|text|border|ring|outline|fill|stroke|shadow|from|via|to)$/.test(utility))
        return `${utility}-<색상토큰> (예: ${utility}-accent)`
      if (/^(?:p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|gap|space|inset|top|right|bottom|left|w|h|size|min-w|min-h|max-w|max-h)$/.test(utility))
        return `${utility}-<spacing토큰> (예: ${utility}-md)`
      if (utility === 'rounded' || utility.startsWith('rounded'))
        return `${utility}-<radius토큰> (예: ${utility}-lg)`
      return '대괄호 임의값 대신 src/tokens/ 의 토큰 유틸리티'
    },
  },
]

/**
 * @returns {{line: number, kind: string, value: string, hint: string}[]}
 */
function findViolations(content, { lineOffset = 0 } = {}) {
  const violations = []
  const lines = content.split('\n')

  lines.forEach((line, index) => {
    if (isExemptLine(line)) return

    for (const rule of RULES) {
      rule.pattern.lastIndex = 0
      let match
      while ((match = rule.pattern.exec(line)) !== null) {
        const value = rule.captureGroup ? match[rule.captureGroup] : match[0]
        violations.push({
          line: index + 1 + lineOffset,
          kind: rule.kind,
          value,
          hint: rule.suggest(value),
        })
      }
    }
  })

  return violations
}

function formatViolations(violations, { filePath, isSnippet }) {
  const where = isSnippet ? '편집 내용' : filePath
  const lines = [
    '',
    '⛔ 하드코딩된 시각 값이 차단되었습니다 (CLAUDE.md 레이어 3 / 목적 1·2)',
    `   대상: ${filePath}`,
    '',
  ]

  for (const v of violations) {
    lines.push(`   ${where} ${v.line}번째 줄 — [${v.kind}] ${v.value}`)
    lines.push(`      → ${v.hint}`)
  }

  lines.push(
    '',
    '   해결 경로는 하나뿐입니다: src/tokens/design-tokens.css 에 역할 기반 토큰을',
    '   추가한 뒤 그 토큰을 참조하세요. 네이밍 규칙은 src/tokens/README.md 참고.',
    '   토큰화가 의미 없는 값이라면 줄 끝에 `token-exempt: <사유>` 를 남기세요',
    '   (사유가 없으면 면제되지 않습니다).',
    '',
  )

  return lines.join('\n')
}

/* ------------------------------------------------------------------ scan mode */

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) walk(full, files)
    else if (TARGET_EXTENSIONS.has(extname(full))) files.push(full)
  }
  return files
}

function runScan() {
  let files
  try {
    files = walk(SCAN_ROOT)
  } catch {
    console.error(`verify:tokens — ${SCAN_ROOT}/ 를 읽을 수 없습니다.`)
    process.exit(1)
  }

  let total = 0
  let scanned = 0

  for (const file of files) {
    if (isExemptFile(file)) continue
    scanned++
    const violations = findViolations(readFileSync(file, 'utf8'))
    if (violations.length === 0) continue

    total += violations.length
    console.error(`\n${relative('.', file)}`)
    for (const v of violations) {
      console.error(`  ${v.line}:  [${v.kind}] ${v.value}`)
      console.error(`      → ${v.hint}`)
    }
  }

  if (total > 0) {
    console.error(
      `\n하드코딩 ${total}건 (검사 ${scanned}개 파일). 목적 1의 완료 기준은 0건입니다.\n`,
    )
    process.exit(1)
  }

  console.log(`✓ 하드코딩 0건 — ${scanned}개 파일 검사 (목적 1 pass)`)
  process.exit(0)
}

/* ------------------------------------------------------------------ hook mode */

function readStdin() {
  try {
    return readFileSync(0, 'utf8')
  } catch {
    return ''
  }
}

/** Collect every chunk of text this tool call would write, with line offsets. */
function extractPayloads(toolInput) {
  if (typeof toolInput?.content === 'string')
    return [{ text: toolInput.content, isSnippet: false }]

  const payloads = []
  if (typeof toolInput?.new_string === 'string')
    payloads.push({ text: toolInput.new_string, isSnippet: true })

  if (Array.isArray(toolInput?.edits)) {
    for (const edit of toolInput.edits) {
      if (typeof edit?.new_string === 'string')
        payloads.push({ text: edit.new_string, isSnippet: true })
    }
  }

  return payloads
}

/* -------------------------------------------------------------- bash mode */

/*
 * A shell command carries no file content — only the command string. There is
 * nothing to scan, so a write that lands in src/ through the shell reaches disk
 * completely unchecked. That is exactly how two 90KB+ data modules were placed
 * during the icon work: generated in a scratch dir, then `cp`-ed into src/.
 *
 * Since the content cannot be inspected, the only honest enforcement is to
 * refuse the write and send it back through Edit/Write, which ARE scanned.
 */

const SHELL_WRITE_VERBS = new Set(['cp', 'mv', 'rsync', 'install', 'ln', 'tee', 'dd'])
const IN_PLACE_EDITORS = new Set(['sed', 'perl', 'awk'])

/* `git checkout -- <path>` and `git apply` drop arbitrary content into a path. */
const GIT_WRITE_SUBCOMMANDS = new Set([
  'checkout', 'restore', 'apply', 'am', 'stash', 'clean', 'reset', 'revert', 'merge', 'cherry-pick',
])

function unquote(token) {
  return token.replace(/^["']/, '').replace(/["']$/, '')
}

/** Split a command line into segments that each run on their own. */
function splitSegments(command) {
  return command.split(/\s*(?:&&|\|\||[;|\n])\s*/).filter(Boolean)
}

/** Every path this segment would write to. Read-only segments yield nothing. */
function writeTargets(segment) {
  const targets = []

  // `> file`, `>> file`, `2> file` — the destination follows the operator.
  const redirect = /(?:^|\s)\d?>>?\s*("[^"]*"|'[^']*'|[^\s;|&]+)/g
  let match
  while ((match = redirect.exec(segment)) !== null) targets.push(unquote(match[1]))

  const tokens = (segment.match(/"[^"]*"|'[^']*'|[^\s]+/g) ?? []).map(unquote)
  if (tokens.length === 0) return targets

  const verb = basename(tokens[0])
  const args = tokens.slice(1).filter((t) => !t.startsWith('-'))

  if (SHELL_WRITE_VERBS.has(verb)) {
    const ofArg = tokens.find((t) => t.startsWith('of='))
    if (ofArg) targets.push(ofArg.slice(3))
    else if (verb === 'tee') targets.push(...args)
    else if (args.length > 0) targets.push(args[args.length - 1])
  }

  if (verb === 'git' && GIT_WRITE_SUBCOMMANDS.has(args[0])) {
    const sub = args[0]
    const paths = args.slice(1)

    // A patch carries its paths inside the file, not on the command line —
    // nothing here can be inspected, so treat it as touching all of src/.
    if (sub === 'apply' || sub === 'am') targets.push(SCAN_ROOT)
    else if (sub === 'checkout' || sub === 'restore') {
      // `git checkout .` rewrites the whole tree; a bare branch name does not.
      if (paths.includes('.')) targets.push(SCAN_ROOT)
      targets.push(...paths)
    }
  }

  // `sed -i`, `perl -i` rewrite their input files in place.
  if (IN_PLACE_EDITORS.has(verb) && tokens.some((t) => /^-.*i/.test(t))) {
    targets.push(...args.filter((a) => TARGET_EXTENSIONS.has(extname(a))))
  }

  return targets
}

/** Would this destination land a scannable source file inside src/? */
function isGuardedDestination(target) {
  const normalized = target.replace(/^\.\//, '')
  const underSrc = normalized === SCAN_ROOT
    || normalized.startsWith(`${SCAN_ROOT}/`)
    || normalized.includes(`/${SCAN_ROOT}/`)
  if (!underSrc) return false
  if (isExemptFile(normalized)) return false

  const ext = extname(normalized)
  // No extension = a directory destination (`cp a.ts src/components/`).
  return ext === '' || TARGET_EXTENSIONS.has(ext)
}

function runBashHook(toolInput) {
  const command = typeof toolInput?.command === 'string' ? toolInput.command : ''
  if (!command.trim()) process.exit(0)

  /*
   * `cd src/components && cp /tmp/a.ts ./a.ts` writes into src/ without the
   * word "src" appearing anywhere near the write. Track cd across segments so
   * relative destinations resolve against the directory actually in effect.
   */
  const blocked = []
  let cwd = ''

  for (const segment of splitSegments(command)) {
    const cdMatch = /^cd\s+("[^"]*"|'[^']*'|[^\s]+)\s*$/.exec(segment.trim())
    if (cdMatch) {
      const dir = unquote(cdMatch[1])
      cwd = dir.startsWith('/') || dir === '-' ? dir : join(cwd, dir)
      continue
    }
    if (/^cd\s*$/.test(segment.trim())) {
      cwd = ''
      continue
    }

    for (const target of writeTargets(segment)) {
      const resolved = target.startsWith('/') ? target : join(cwd, target)
      if (isGuardedDestination(resolved) && !blocked.includes(resolved)) blocked.push(resolved)
    }
  }

  if (blocked.length === 0) process.exit(0)

  process.stderr.write(
    [
      '',
      '⛔ 셸을 통한 src/ 쓰기가 차단되었습니다 (CLAUDE.md 레이어 3 / 목적 2)',
      `   대상: ${blocked.join(', ')}`,
      '',
      '   셸 명령에는 파일 내용이 실려 있지 않아 토큰 검사를 할 수 없습니다.',
      '   검사되지 않은 쓰기를 통과시키면 레이어 3이 최종 방어선이 아니게 되므로,',
      '   내용을 볼 수 없는 경로 자체를 막습니다.',
      '',
      '   해결 경로: Edit / Write / MultiEdit 도구로 쓰세요 — 이 경로는 내용이',
      '   검사되고, 위반 값과 대체 토큰 이름이 함께 보고됩니다.',
      '   파일이 Write 한도를 넘길 만큼 크면 여러 모듈로 나눠서 쓰세요.',
      '',
    ].join('\n'),
  )
  process.exit(2)
}

function runHook() {
  const raw = readStdin()
  if (!raw.trim()) process.exit(0)

  let payload
  try {
    payload = JSON.parse(raw)
  } catch {
    // Never block on a parse failure — a broken hook must not halt all editing.
    process.exit(0)
  }

  if (payload.tool_name === 'Bash') runBashHook(payload.tool_input ?? {})

  const toolInput = payload.tool_input ?? {}
  const filePath = toolInput.file_path ?? ''
  if (!filePath || !TARGET_EXTENSIONS.has(extname(filePath))) process.exit(0)
  if (isExemptFile(filePath)) process.exit(0)

  const violations = []
  let isSnippet = false

  for (const { text, isSnippet: snippet } of extractPayloads(toolInput)) {
    if (snippet) isSnippet = true
    violations.push(...findViolations(text))
  }

  if (violations.length === 0) process.exit(0)

  process.stderr.write(formatViolations(violations, { filePath, isSnippet }))
  process.exit(2)
}

process.argv.includes('--scan') ? runScan() : runHook()
