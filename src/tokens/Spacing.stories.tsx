import type { Meta, StoryObj } from '@storybook/react'
import { useCssVars } from './tokenValues'

/*
 * Spacing scale gallery.
 *
 * Each row draws a bar whose width IS the token (`w-24` resolves to
 * var(--spacing-24)), so the picture cannot disagree with the value printed
 * next to it. Both the variable name and the width utility are written out in
 * full because Tailwind scans source text for class candidates.
 *
 * That bar is also what makes the value readable: Tailwind emits an `@theme`
 * variable to `:root` only when a generated utility references it, so a step
 * listed here but never rendered would print as empty. See ./tokenValues.ts.
 */

const FIGMA_TOKENS_URL =
  'https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19561-25592'

/**
 * [custom property, width utility, representative usage utility, published by
 * Figma as a `spacing/*` variable?]
 *
 * The last flag mirrors the "코드 전용" column of docs/design-tokens.md. Ten of
 * these steps are Figma variables; the rest are values measured off a frame
 * because `get_variable_defs` returns no size variable there. Each measured
 * step carries its own source note in ./spacing.tokens.css — the flag only says
 * which kind a step is, not why, so this list cannot go stale against it.
 */
type Step = readonly [
  variable: string,
  widthClass: string,
  usageClass: string,
  fromFigma: boolean,
]

const STEPS: readonly Step[] = [
  ['--spacing-4', 'w-4', 'p-4', true],
  ['--spacing-8', 'w-8', 'p-8', true],
  ['--spacing-12', 'w-12', 'p-12', true],
  ['--spacing-16', 'w-16', 'p-16', true],
  ['--spacing-18', 'w-18', 'p-18', false],
  ['--spacing-20', 'w-20', 'p-20', true],
  ['--spacing-24', 'w-24', 'p-24', true],
  ['--spacing-32', 'w-32', 'p-32', true],
  ['--spacing-36', 'w-36', 'p-36', false],
  ['--spacing-38', 'w-38', 'p-38', false],
  ['--spacing-40', 'w-40', 'p-40', true],
  ['--spacing-44', 'w-44', 'p-44', false],
  ['--spacing-48', 'w-48', 'p-48', true],
  ['--spacing-56', 'w-56', 'p-56', false],
  ['--spacing-64', 'w-64', 'p-64', true],
  ['--spacing-76', 'w-76', 'p-76', false],
  ['--spacing-78', 'w-78', 'p-78', false],
  ['--spacing-80', 'w-80', 'p-80', false],
  ['--spacing-82', 'w-82', 'p-82', false],
  ['--spacing-92', 'w-92', 'p-92', false],
  ['--spacing-96', 'w-96', 'p-96', false],
  ['--spacing-140', 'w-140', 'p-140', false],
  ['--spacing-180', 'w-180', 'p-180', false],
  // Role-named, and their usage utility is deliberately not a padding: nothing
  // draws either of them as inner spacing. The hairline is a filled rule
  // (`h-hairline` + a background colour, or `border-hairline` for a real CSS
  // border) and the underline is the active nav Tab's rule and the gap under
  // its label (`h-underline`, `gap-underline`).
  ['--spacing-hairline', 'w-hairline', 'h-hairline', false],
  ['--spacing-underline', 'w-underline', 'h-underline', false],
]

/** The padding demo below shows only steps something actually uses that way. */
const PADDING_STEPS = STEPS.filter(([, , usageClass]) => usageClass.startsWith('p-'))

const NAMES = STEPS.map(([variable]) => variable)
const FIGMA_STEP_COUNT = STEPS.filter(([, , , fromFigma]) => fromFigma).length

function SpacingGallery() {
  const values = useCssVars(NAMES)

  return (
    <div className="bg-bg-default p-24 text-text-primary">
      <h1 className="type-title-small">Spacing</h1>
      <p className="type-body-default mt-8 text-text-tertiary">
        스텝 이름은 Figma 의 숫자를 그대로 쓴다 — spacing/16 → --spacing-16 → p-16.
        Tailwind 의 기본 배수 스케일(p-5 = 5 × 기본 단위)은 여기 이름 붙은 스텝에는
        적용되지 않으므로 두 체계를 섞지 않는다.
      </p>
      <p className="type-body-default mt-8 text-text-tertiary">
        {STEPS.length}개 중 {FIGMA_STEP_COUNT}개가 Figma 의 spacing/* 변수이고, 나머지{' '}
        {STEPS.length - FIGMA_STEP_COUNT}개는 Figma 가 변수로 발행하지 않아 프레임에서
        잰 코드 전용 스텝이다(각 줄 끝에 표시). 실측 스텝도 이름을 붙여야 하는 이유는
        내장 스케일이 조용히 다른 값을 내주기 때문이다 — 이름이 없으면 w-96 은 96 ×
        기본 단위로 해석돼 네 배가 되고, hook 은 그것을 잡지 못한다. hairline 과
        underline 만 역할 이름을 쓴다: 숫자 이름이 Tailwind 내장 스텝을 가리는 데다,
        이 스케일의 하한보다 얇은 rule 두께라 스텝이 아니다.
      </p>

      <div className="mt-24 flex flex-col gap-12">
        {STEPS.map(([variable, widthClass, usageClass, fromFigma]) => (
          <div key={variable} className="flex items-center gap-16">
            <code className="type-body-default-strong w-180 shrink-0">{widthClass}</code>
            <div className={`h-16 shrink-0 rounded-4 bg-brand-primary ${widthClass}`} />
            <span className="type-body-small text-text-tertiary">
              {variable} = {values[variable] || '—'} · {usageClass} ·{' '}
              {fromFigma ? 'Figma spacing/*' : '코드 전용 (실측)'}
            </span>
          </div>
        ))}
      </div>

      <section className="mt-40">
        <h2 className="type-subtitle-medium-strong">패딩 적용 예</h2>
        <p className="type-body-small mt-4 text-text-tertiary">
          같은 스텝을 안쪽 여백으로 썼을 때. 숫자 스텝 {PADDING_STEPS.length}개만 —
          hairline 과 underline 은 안쪽 여백으로 쓰이지 않는다.
        </p>
        <div className="mt-16 flex flex-wrap items-start gap-16">
          {PADDING_STEPS.map(([variable, , paddingClass]) => (
            <div
              key={variable}
              className={`rounded-8 border border-border-default bg-bg-subtle ${paddingClass}`}
            >
              <div className="h-24 w-24 rounded-4 bg-action-primary" />
              <p className="type-body-small mt-4 text-text-tertiary">{paddingClass}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

const meta: Meta<typeof SpacingGallery> = {
  title: 'Design Tokens/Spacing',
  component: SpacingGallery,
  parameters: {
    layout: 'fullscreen',
    design: { type: 'figma', url: FIGMA_TOKENS_URL },
    docs: {
      description: {
        component:
          'src/tokens/spacing.tokens.css 의 25 스텝 — Figma spacing/* 10개 + 코드 전용 실측 15개. 막대 너비가 곧 토큰 값이라 그림과 값이 어긋날 수 없다. layout/* 에서 온 --spacing-gutter · -viewport-inset · -banner-inset · -banner-padding 은 Layout 갤러리에 있다.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Scale: Story = {}
