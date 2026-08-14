import type { Meta, StoryObj } from '@storybook/react'
import { useCssVars } from './tokenValues'

/*
 * Radius scale gallery.
 *
 * Same shape as Spacing: the corner you see is the token itself
 * (`rounded-12` resolves to var(--radius-12)), and the printed value is read
 * back from the custom property at runtime rather than copied into this file.
 */

const FIGMA_TOKENS_URL =
  'https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19561-25592'

/** [custom property, rounded utility] */
type Step = readonly [variable: string, roundedClass: string]

const STEPS: readonly Step[] = [
  ['--radius-4', 'rounded-4'],
  ['--radius-6', 'rounded-6'],
  ['--radius-8', 'rounded-8'],
  ['--radius-12', 'rounded-12'],
  ['--radius-28', 'rounded-28'],
  ['--radius-full', 'rounded-full'],
]

const NAMES = STEPS.map(([variable]) => variable)

function RadiusGallery() {
  const values = useCssVars(NAMES)

  return (
    <div className="bg-bg-default p-24 text-text-primary">
      <h1 className="type-title-small">Radius</h1>
      <p className="type-body-default mt-8 text-text-tertiary">
        Spacing 과 마찬가지로 Figma 의 숫자 스텝을 그대로 쓴다 — radius/8 →
        --radius-8 → rounded-8. rounded-full 만 예외적으로 이름이 역할이다.
      </p>

      <div className="mt-24 flex flex-wrap gap-24">
        {STEPS.map(([variable, roundedClass]) => (
          <div key={variable} className="flex flex-col items-center gap-8">
            <div
              className={`h-64 w-64 border border-border-strong bg-bg-subtle ${roundedClass}`}
            />
            <code className="type-body-default-strong">{roundedClass}</code>
            <span className="type-body-small text-text-tertiary">
              {values[variable] || '—'}
            </span>
          </div>
        ))}
      </div>

      <section className="mt-40">
        <h2 className="type-subtitle-medium-strong">면 위에서</h2>
        <p className="type-body-small mt-4 text-text-tertiary">
          같은 스텝을 채워진 카드에 적용했을 때.
        </p>
        <div className="mt-16 flex flex-wrap gap-16">
          {STEPS.map(([variable, roundedClass]) => (
            <div
              key={variable}
              className={`bg-surface-inverse p-16 text-text-inverse ${roundedClass}`}
            >
              <span className="type-body-small">{roundedClass}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

const meta: Meta<typeof RadiusGallery> = {
  title: 'Design Tokens/Radius',
  component: RadiusGallery,
  parameters: {
    layout: 'fullscreen',
    design: { type: 'figma', url: FIGMA_TOKENS_URL },
    docs: {
      description: {
        component: 'src/tokens/radius.tokens.css 의 6 스텝.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Scale: Story = {}
