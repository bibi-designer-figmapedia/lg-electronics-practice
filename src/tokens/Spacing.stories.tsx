import type { Meta, StoryObj } from '@storybook/react'
import { useCssVars } from './tokenValues'

/*
 * Spacing scale gallery.
 *
 * Each row draws a bar whose width IS the token (`w-24` resolves to
 * var(--spacing-24)), so the picture cannot disagree with the value printed
 * next to it. Both the variable name and the width utility are written out in
 * full because Tailwind scans source text for class candidates.
 */

const FIGMA_TOKENS_URL =
  'https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19561-25592'

/** [custom property, width utility, padding utility shown as a usage example] */
type Step = readonly [variable: string, widthClass: string, paddingClass: string]

const STEPS: readonly Step[] = [
  ['--spacing-4', 'w-4', 'p-4'],
  ['--spacing-8', 'w-8', 'p-8'],
  ['--spacing-12', 'w-12', 'p-12'],
  ['--spacing-16', 'w-16', 'p-16'],
  ['--spacing-20', 'w-20', 'p-20'],
  ['--spacing-24', 'w-24', 'p-24'],
  ['--spacing-32', 'w-32', 'p-32'],
  ['--spacing-40', 'w-40', 'p-40'],
  ['--spacing-44', 'w-44', 'p-44'],
  ['--spacing-48', 'w-48', 'p-48'],
  ['--spacing-64', 'w-64', 'p-64'],
]

const NAMES = STEPS.map(([variable]) => variable)

function SpacingGallery() {
  const values = useCssVars(NAMES)

  return (
    <div className="bg-bg-default p-24 text-text-primary">
      <h1 className="type-title-small">Spacing</h1>
      <p className="type-body-default mt-8 text-text-tertiary">
        스텝 이름은 Figma 의 숫자를 그대로 쓴다 — spacing/16 → --spacing-16 → p-16.
        Tailwind 의 기본 배수 스케일(p-5 = 5 × 0.25rem)은 여기 이름 붙은 스텝에는
        적용되지 않으므로 두 체계를 섞지 않는다.
      </p>

      <div className="mt-24 flex flex-col gap-12">
        {STEPS.map(([variable, widthClass, paddingClass]) => (
          <div key={variable} className="flex items-center gap-16">
            <code className="type-body-default-strong w-64 shrink-0">{widthClass}</code>
            <div className={`h-16 shrink-0 rounded-4 bg-brand-primary ${widthClass}`} />
            <span className="type-body-small text-text-tertiary">
              {variable} = {values[variable] || '—'} · {paddingClass}
            </span>
          </div>
        ))}
      </div>

      <section className="mt-40">
        <h2 className="type-subtitle-medium-strong">패딩 적용 예</h2>
        <p className="type-body-small mt-4 text-text-tertiary">
          같은 스텝을 안쪽 여백으로 썼을 때.
        </p>
        <div className="mt-16 flex flex-wrap items-start gap-16">
          {STEPS.map(([variable, , paddingClass]) => (
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
          'src/tokens/spacing.tokens.css 의 11 스텝. 막대 너비가 곧 토큰 값이라 그림과 값이 어긋날 수 없다.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Scale: Story = {}
