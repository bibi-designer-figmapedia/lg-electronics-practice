/*
 * Runtime reader for the custom properties defined in src/tokens/.
 *
 * The token galleries print each token's value next to its swatch. That value
 * is deliberately NOT copied into the story source: a copy drifts the moment a
 * token file changes, and raw visual values outside src/tokens/ are blocked by
 * the hardcode hook anyway (CLAUDE.md 목적 1·2). So the stories read the values
 * back out of the DOM after the stylesheet has been applied.
 *
 * Caveat worth knowing before adding a token to a gallery: Tailwind emits an
 * `@theme` variable to `:root` only when some generated utility references it.
 * A token is therefore readable here only if the gallery also renders a
 * utility that uses it — which the galleries do, since every row shows one.
 * Tokens whose value Tailwind inlines instead of referencing (the `--shadow-*`
 * steps) are not readable this way; Elevation reads the computed `box-shadow`
 * off the rendered element instead.
 */

import { useEffect, useState } from 'react'

/** Resolved value of one custom property on `:root`, or '' if it is not set. */
export function readCssVar(name: string): string {
  if (typeof document === 'undefined') return ''
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

function readAll<T extends string>(names: readonly T[]): Record<T, string> {
  return Object.fromEntries(names.map((name) => [name, readCssVar(name)])) as Record<
    T,
    string
  >
}

function blank<T extends string>(names: readonly T[]): Record<T, string> {
  return Object.fromEntries(names.map((name) => [name, ''])) as Record<T, string>
}

/**
 * Read several custom properties after mount.
 *
 * Pass a module-level constant array — the effect keys off the joined names, so
 * a fresh array literal per render still reads only once.
 */
export function useCssVars<T extends string>(names: readonly T[]): Record<T, string> {
  const key = names.join(',')
  const [values, setValues] = useState<Record<T, string>>(() => blank(names))

  useEffect(() => {
    setValues(readAll(names))
    // `key` stands in for `names`: same names, same read.
  }, [key])

  return values
}
