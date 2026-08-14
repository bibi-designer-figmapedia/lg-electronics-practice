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
