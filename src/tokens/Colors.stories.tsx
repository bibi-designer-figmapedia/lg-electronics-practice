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
  // The one entry here with no Figma primitive name: it is the resolved value
  // `banner/label` carries, and the source file publishes no primitive holding
  // it. See colors.tokens.css. Listed anyway, or the banner group below could
  // not name the primitive it points at.
  '--lg-dark-gray-4',
  '--lg-toast-gray',
  '--lg-near-black',
  '--lg-black',
  '--lg-white',
  // The palette's only translucent entry (Figma `white-60`). Its swatch is
  // drawn on the inverse surface below — over the white page it would be white.
  '--lg-white-60',
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
    title: 'background',
    note: 'Figma background/*. 위 bg/* 와 다른 그룹이다 — 색상 문서 프레임은 bg/* 다섯 개만 발행하고 bg/lv1 은 없으며, background/LV1 은 Pmax 배너 캔버스(19661:21073)에서만 나온다. banner/label 과 같은 이유로 그룹 이름을 합치지 않는다',
    swatches: [['--color-background-lv1', 'bg-background-lv1']],
  },
  {
    title: 'surface',
    note: '컴포넌트 레벨 채움 (Figma surface/*). blur-blind 만 반투명이라 반전 표면 위에 그린다 — 흰 페이지 위에서는 보이지 않는다',
    swatches: [
      ['--color-surface-card', 'bg-surface-card'],
      ['--color-surface-toast-error', 'bg-surface-toast-error'],
      ['--color-surface-toast-warning', 'bg-surface-toast-warning'],
      ['--color-surface-toast-info', 'bg-surface-toast-info'],
      ['--color-surface-inverse', 'bg-surface-inverse'],
      ['--color-surface-blur-blind', 'bg-surface-blur-blind'],
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
    title: 'banner',
    note: '배너 라벨 (Figma banner/*). Figma 가 text/* 가 아니라 자기 그룹에 두었으므로 이름도 그대로 따른다',
    swatches: [['--color-banner-label', 'bg-banner-label']],
  },
  {
    title: 'border',
    note: '테두리 (Figma border/*). focus-inverse 만 Figma 변수가 아니다 — 반전 표면 위 포커스 링 전용이고, border-inverse 와 값은 같지만 역할이 달라 나눠 둔다',
    swatches: [
      ['--color-border-default', 'bg-border-default'],
      ['--color-border-strong', 'bg-border-strong'],
      ['--color-border-focus', 'bg-border-focus'],
      ['--color-border-inverse', 'bg-border-inverse'],
      ['--color-border-focus-inverse', 'bg-border-focus-inverse'],
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
    title: 'brand — 외부 브랜드 마크',
    note: 'Figma 변수가 아니고 LG 팔레트도 아니다. 소셜 로그인 버튼의 Google "G" 와 Facebook "f" 아트워크 색으로, .tsx 가 raw hex 를 가질 수 없어 등재했을 뿐이다. 해당 벤더 마크 밖에서 재사용 금지 — 벤더 자산을 다시 칠하면 사용 조건을 어기고, LG 가 바꿀 수 없는 색에 LG 화면이 묶인다',
    swatches: [
      ['--color-brand-google-red', 'bg-brand-google-red'],
      ['--color-brand-google-yellow', 'bg-brand-google-yellow'],
      ['--color-brand-google-green', 'bg-brand-google-green'],
      ['--color-brand-google-blue', 'bg-brand-google-blue'],
      ['--color-brand-facebook', 'bg-brand-facebook'],
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
      ['--color-icon-white', 'bg-icon-white'],
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
              // A white fill on this white page is an invisible swatch. The
              // tokens that resolve to --lg-white are exactly the ones drawn on
              // an inverted surface anyway, so they get shown the way the rest
              // of the galleries show inverse values: on bg-surface-inverse.
              // Derived from the value, not from a per-row flag, so a token that
              // is later repointed at white cannot be missed here.
              // --lg-white-60 joins it for the same reason and gains one: 60%
              // white over a white page is still white, while over the inverse
              // surface the translucency is what you actually see.
              const onInverse = primitive === '--lg-white' || primitive === '--lg-white-60'

              return (
                <div
                  key={variable}
                  className="overflow-hidden rounded-8 border border-border-default"
                >
                  {onInverse ? (
                    <div className="bg-surface-inverse p-12">
                      <div className={`h-24 w-full rounded-4 ${swatchClass}`} />
                    </div>
                  ) : (
                    <div className={`h-48 w-full ${swatchClass}`} />
                  )}
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
