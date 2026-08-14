import type { Meta, StoryObj } from '@storybook/react'
import { useCssVars } from './tokenValues'

/*
 * Color token gallery.
 *
 * Shows the semantic layer only — the layer components are allowed to use.
 * The `:root` primitives (`--lg-active-red`, …) are intentionally outside
 * `@theme`, so Tailwind emits no `bg-lg-*` utility for them and there is no
 * token-compliant way to paint a swatch with one. Instead each semantic row
 * names the primitive it resolves to, matched by value at runtime, so the
 * two-layer mapping documented in colors.tokens.css stays visible without
 * being duplicated here.
 *
 * Both strings per row are written out in full on purpose: Tailwind scans the
 * source text for class candidates, so a className assembled at runtime from
 * the variable name would never be generated.
 */

const FIGMA_TOKENS_URL =
  'https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19561-25592'

/** Primitive palette, in colors.tokens.css order. Names only — values are read at runtime. */
const PRIMITIVES = [
  '--lg-active-red',
  '--lg-heritage-red',
  '--lg-bright-red',
  '--lg-ad-red',
  '--lg-light-gray-0',
  '--lg-light-gray-1',
  '--lg-light-gray-2',
  '--lg-light-gray-3',
  '--lg-mid-gray-1',
  '--lg-mid-gray-2',
  '--lg-mid-gray-3',
  '--lg-dark-gray-1',
  '--lg-dark-gray-2',
  '--lg-dark-gray-3',
  '--lg-toast-gray',
  '--lg-near-black',
  '--lg-black',
  '--lg-white',
  '--lg-logo-gray',
  '--lg-green-1',
  '--lg-green-2',
  '--lg-yellow-1',
  '--lg-yellow-2',
  '--lg-teal-1',
] as const

/*
 * The badge gradient. Not a semantic color token and not in `--color-*`: a
 * gradient is a background-image, so it is exposed as its own utility. Kept out
 * of GROUPS below so it does not count toward the semantic total.
 */
const GRADIENT = {
  variable: '--gradient-badge',
  utility: 'bg-gradient-badge',
} as const

/** [custom property, background utility that paints it] */
type Swatch = readonly [variable: string, swatchClass: string]

type Group = {
  title: string
  note: string
  swatches: readonly Swatch[]
}

const GROUPS: readonly Group[] = [
  {
    title: 'bg',
    note: '페이지 레벨 배경 (Figma bg/*)',
    swatches: [
      ['--color-bg-default', 'bg-bg-default'],
      ['--color-bg-warm', 'bg-bg-warm'],
      ['--color-bg-subtle', 'bg-bg-subtle'],
      ['--color-bg-elevated', 'bg-bg-elevated'],
      ['--color-bg-light', 'bg-bg-light'],
    ],
  },
  {
    title: 'surface',
    note: '컴포넌트 레벨 채움 (Figma surface/*)',
    swatches: [
      ['--color-surface-card', 'bg-surface-card'],
      ['--color-surface-toast-error', 'bg-surface-toast-error'],
      ['--color-surface-toast-warning', 'bg-surface-toast-warning'],
      ['--color-surface-toast-info', 'bg-surface-toast-info'],
      ['--color-surface-inverse', 'bg-surface-inverse'],
    ],
  },
  {
    title: 'text',
    note: '본문·라벨 색 (Figma text/*)',
    swatches: [
      ['--color-text-primary', 'bg-text-primary'],
      ['--color-text-secondary', 'bg-text-secondary'],
      ['--color-text-tertiary', 'bg-text-tertiary'],
      ['--color-text-disabled', 'bg-text-disabled'],
      ['--color-text-inverse', 'bg-text-inverse'],
      ['--color-text-brand', 'bg-text-brand'],
      ['--color-text-disclaimer', 'bg-text-disclaimer'],
      ['--color-text-disclaimer-inverse', 'bg-text-disclaimer-inverse'],
      ['--color-text-on-toast-error', 'bg-text-on-toast-error'],
      ['--color-text-on-toast-warning', 'bg-text-on-toast-warning'],
      ['--color-text-on-toast-info', 'bg-text-on-toast-info'],
    ],
  },
  {
    title: 'border',
    note: '테두리 (Figma border/*)',
    swatches: [
      ['--color-border-default', 'bg-border-default'],
      ['--color-border-strong', 'bg-border-strong'],
      ['--color-border-focus', 'bg-border-focus'],
      ['--color-border-inverse', 'bg-border-inverse'],
    ],
  },
  {
    title: 'brand',
    note: '브랜드 아이덴티티 (Figma brand/*)',
    swatches: [
      ['--color-brand-primary', 'bg-brand-primary'],
      ['--color-brand-logo', 'bg-brand-logo'],
      ['--color-brand-logo-inverse', 'bg-brand-logo-inverse'],
      ['--color-brand-secondary', 'bg-brand-secondary'],
    ],
  },
  {
    title: 'state',
    note: '상태 표시 (Figma state/*). *-on-warm 은 bg-warm 위에서 쓰는 대비 보정 쌍',
    swatches: [
      ['--color-state-success', 'bg-state-success'],
      ['--color-state-success-on-warm', 'bg-state-success-on-warm'],
      ['--color-state-warning', 'bg-state-warning'],
      ['--color-state-error', 'bg-state-error'],
      ['--color-state-error-on-warm', 'bg-state-error-on-warm'],
      ['--color-state-info', 'bg-state-info'],
    ],
  },
  {
    title: 'icon',
    note: '아이콘 (Figma icon/*)',
    swatches: [
      ['--color-icon-default', 'bg-icon-default'],
      ['--color-icon-active', 'bg-icon-active'],
      ['--color-icon-muted', 'bg-icon-muted'],
    ],
  },
  {
    title: 'action',
    note: '인터랙티브 요소 (Figma action/*)',
    swatches: [
      ['--color-action-primary', 'bg-action-primary'],
      ['--color-action-promo', 'bg-action-promo'],
      ['--color-action-primary-label', 'bg-action-primary-label'],
      ['--color-action-secondary', 'bg-action-secondary'],
      ['--color-action-secondary-label', 'bg-action-secondary-label'],
      ['--color-action-secondary-border', 'bg-action-secondary-border'],
      ['--color-action-disabled', 'bg-action-disabled'],
    ],
  },
  {
    title: 'flag · review',
    note: '뱃지와 별점 (Figma flag/*, review/*)',
    swatches: [
      ['--color-flag-general', 'bg-flag-general'],
      ['--color-flag-promotion', 'bg-flag-promotion'],
      ['--color-review-star', 'bg-review-star'],
    ],
  },
  {
    title: 'shadow',
    note: '그림자 *색상*만 (Figma shadow/*). offset·blur 은 Figma 에 변수가 없다 — Elevation 참고',
    swatches: [
      ['--color-shadow-disclaimer', 'bg-shadow-disclaimer'],
      ['--color-shadow-disclaimer-inverse', 'bg-shadow-disclaimer-inverse'],
    ],
  },
]

const SEMANTIC_NAMES = GROUPS.flatMap((group) =>
  group.swatches.map(([variable]) => variable),
)
const ALL_NAMES = [...PRIMITIVES, ...SEMANTIC_NAMES, GRADIENT.variable]

function ColorGallery() {
  const values = useCssVars(ALL_NAMES)

  // Semantic tokens resolve all the way down to the primitive's own value, so
  // matching on the value recovers which primitive each one points at.
  const primitiveByValue = new Map(
    PRIMITIVES.map((name) => [values[name].toLowerCase(), name]),
  )

  return (
    <div className="bg-bg-default p-24 text-text-primary">
      <h1 className="type-title-small">Color</h1>
      <p className="type-body-default mt-8 text-text-tertiary">
        시맨틱 {SEMANTIC_NAMES.length}개 · 프리미티브 {PRIMITIVES.length}개. 컴포넌트가
        참조하는 것은 시맨틱 레이어뿐이다.
      </p>

      {GROUPS.map((group) => (
        <section key={group.title} className="mt-32">
          <h2 className="type-subtitle-medium-strong">{group.title}</h2>
          <p className="type-body-small mt-4 text-text-tertiary">{group.note}</p>

          <div className="mt-16 grid grid-cols-2 gap-16 sm:grid-cols-3 lg:grid-cols-4">
            {group.swatches.map(([variable, swatchClass]) => {
              const value = values[variable]
              const primitive = primitiveByValue.get(value.toLowerCase())

              return (
                <div
                  key={variable}
                  className="overflow-hidden rounded-8 border border-border-default"
                >
                  <div className={`h-48 w-full ${swatchClass}`} />
                  <div className="bg-bg-default p-12">
                    <p className="type-body-default-strong break-all">{swatchClass}</p>
                    <p className="type-body-small mt-4 break-all text-text-tertiary">
                      {variable}
                    </p>
                    <p className="type-body-small mt-4 text-text-tertiary">
                      {value || '—'} {primitive ? `· ${primitive}` : ''}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      ))}

      <section className="mt-32">
        <h2 className="type-subtitle-medium-strong">gradient</h2>
        <p className="type-body-small mt-4 text-text-tertiary">
          Figma gradient/badge. Figma 쪽에서는 그라디언트 스톱에 변수를 바인딩할 수
          없어 raw hex로 적혀 있고, 원본 파일도 &quot;primitive 값을 바꾸면 자동
          반영되지 않는다&quot;고 경고한다. 코드에서는 세 red primitive 를 var() 로
          합성했으므로 그 경고가 해당되지 않는다 — primitive 를 고치면 아래 띠도 따라
          움직인다.
        </p>

        <div className="mt-16 overflow-hidden rounded-8 border border-border-default">
          <div className={`h-48 w-full ${GRADIENT.utility}`} />
          <div className="bg-bg-default p-12">
            <p className="type-body-default-strong break-all">{GRADIENT.utility}</p>
            <p className="type-body-small mt-4 break-all text-text-tertiary">
              {GRADIENT.variable} = {values[GRADIENT.variable] || '—'}
            </p>
          </div>
        </div>

        <div className={`mt-16 inline-block rounded-full px-12 py-4 ${GRADIENT.utility}`}>
          <span className="type-badge-small text-text-inverse">신제품</span>
        </div>
      </section>
    </div>
  )
}

const meta: Meta<typeof ColorGallery> = {
  title: 'Design Tokens/Colors',
  component: ColorGallery,
  parameters: {
    layout: 'fullscreen',
    design: { type: 'figma', url: FIGMA_TOKENS_URL },
    docs: {
      description: {
        component:
          'src/tokens/colors.tokens.css 의 시맨틱 색상 토큰. 값은 소스에 적지 않고 런타임에 CSS 변수에서 읽는다.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const AllColors: Story = {}
