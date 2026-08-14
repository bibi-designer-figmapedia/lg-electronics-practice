import type { Meta, StoryObj } from '@storybook/react'
import { useCssVars } from './tokenValues'

/*
 * Layout token gallery — the page skeleton from Figma's "02. Layout" group.
 *
 * The demo band below is drawn at *real* size: it is 1920 wide because that is
 * what layout/viewport says, and it scrolls sideways rather than being squeezed
 * to fit. A proportional mini-diagram would need widths that are neither the
 * token nor honest about it, so the choice is full scale plus a scrollbar.
 *
 * Every utility in the table is also used in the demo, and that is load-bearing:
 * Tailwind emits an `@theme` variable to `:root` only when some generated utility
 * references it, so a token that appears in the table but nowhere in the markup
 * would read back as empty. See the caveat in ./tokenValues.ts.
 */

const FIGMA_TOKENS_URL =
  'https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19561-25592'

type Row = readonly [
  variable: string,
  figmaVariable: string,
  utility: string,
  purpose: string,
]

const WIDTHS: readonly Row[] = [
  ['--container-viewport', 'layout/viewport', 'w-viewport', '전체 뷰포트 너비'],
  ['--container-banner', 'layout/banner', 'max-w-banner', '배너 영역 최대 너비'],
  [
    '--container-container',
    'layout/container',
    'max-w-container',
    '콘텐츠 컨테이너 최대 너비',
  ],
  [
    '--container-filter-width',
    'layout/filter-width',
    'w-filter-width',
    '필터 패널 너비',
  ],
]

const INSETS: readonly Row[] = [
  ['--spacing-gutter', 'layout/gutter', 'gap-gutter', '그리드 컬럼 간격'],
  [
    '--spacing-viewport-inset',
    'layout/viewport-inset',
    'px-viewport-inset',
    '뷰포트 좌우 여백 — Figma 에서 (viewport − container) / 2',
  ],
  [
    '--spacing-banner-inset',
    'layout/banner-inset',
    'px-banner-inset',
    '배너 좌우 여백 — Figma 에서 (viewport − banner) / 2',
  ],
  [
    '--spacing-banner-padding',
    'layout/banner-padding',
    'p-banner-padding',
    '배너 내부 패딩',
  ],
]

const ALL_NAMES = [...WIDTHS, ...INSETS].map(([variable]) => variable)

function TokenTable({
  title,
  note,
  rows,
  values,
}: {
  title: string
  note: string
  rows: readonly Row[]
  values: Record<string, string>
}) {
  return (
    <section className="mt-32">
      <h2 className="type-subtitle-medium-strong">{title}</h2>
      <p className="type-body-small mt-4 text-text-tertiary">{note}</p>

      <div className="mt-16 flex flex-col">
        {rows.map(([variable, figmaVariable, utility, purpose]) => (
          <div
            key={variable}
            className="flex flex-wrap items-baseline gap-12 border-t border-border-default py-12"
          >
            <code className="type-body-default-strong">{utility}</code>
            <span className="type-body-small text-text-tertiary">
              {figmaVariable} → {variable} = {values[variable] || '—'}
            </span>
            <span className="type-body-small text-text-tertiary">{purpose}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function LayoutGallery() {
  const values = useCssVars(ALL_NAMES)

  return (
    <div className="bg-bg-default p-24 text-text-primary">
      <h1 className="type-title-small">Layout</h1>
      <p className="type-body-default mt-8 text-text-tertiary">
        Figma layout/* 8개. 너비는 --container-* 로, 여백은 --spacing-* 로 나눠
        정의했다 — Tailwind v4 에는 --layout-* 네임스페이스가 없어서 Figma 그룹 이름을
        접두어로 쓰면 유틸리티가 생성되지 않는다. Figma 이름은 아래 표에 남겨 1:1 대응을
        추적할 수 있게 했다.
      </p>

      <TokenTable
        title="너비"
        note="--container-* 네임스페이스 → max-w-* · w-* 유틸리티"
        rows={WIDTHS}
        values={values}
      />

      <TokenTable
        title="여백 · 간격"
        note="--spacing-* 네임스페이스 → p-* · px-* · gap-* 유틸리티. gutter 는 값을 다시 적지 않고 --spacing-24 를 참조하므로 두 스텝이 어긋날 수 없다."
        rows={INSETS}
        values={values}
      />

      <section className="mt-40">
        <h2 className="type-subtitle-medium-strong">구조</h2>
        <p className="type-body-small mt-4 text-text-tertiary">
          실제 크기로 그렸다 — 아래 띠의 너비가 곧 layout/viewport 다. 화면보다 넓으면
          가로로 스크롤된다. 축소해서 맞추면 눈에 보이는 너비가 토큰 값이 아니게 된다.
        </p>

        <div className="mt-16 overflow-x-auto rounded-8 border border-border-default">
          <div className="w-viewport bg-bg-light py-24">
            <div className="px-viewport-inset">
              <div className="max-w-container rounded-8 border border-border-strong bg-surface-card p-24">
                <p className="type-body-default-strong">max-w-container</p>
                <p className="type-body-small mt-4 text-text-tertiary">
                  px-viewport-inset 안에 놓인 콘텐츠 컨테이너
                </p>
              </div>
            </div>

            <div className="mt-24 px-banner-inset">
              <div className="max-w-banner rounded-8 bg-surface-inverse p-banner-padding">
                <p className="type-body-default-strong text-text-inverse">
                  max-w-banner + p-banner-padding
                </p>
                <p className="type-body-small mt-4 text-text-inverse">
                  px-banner-inset 안에 놓인 배너
                </p>
              </div>
            </div>

            <div className="mt-24 flex gap-gutter px-viewport-inset">
              <aside className="w-filter-width shrink-0 rounded-8 border border-border-default bg-bg-subtle p-16">
                <p className="type-body-default-strong">w-filter-width</p>
                <p className="type-body-small mt-4 text-text-tertiary">필터 패널</p>
              </aside>
              <div className="flex-1 rounded-8 border border-border-default bg-bg-subtle p-16">
                <p className="type-body-default-strong">gap-gutter</p>
                <p className="type-body-small mt-4 text-text-tertiary">
                  좌측 패널과 이 영역 사이 간격
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

const meta: Meta<typeof LayoutGallery> = {
  title: 'Design Tokens/Layout',
  component: LayoutGallery,
  parameters: {
    layout: 'fullscreen',
    design: { type: 'figma', url: FIGMA_TOKENS_URL },
    docs: {
      description: {
        component:
          'src/tokens/layout.tokens.css 의 레이아웃 토큰 8개. 값은 소스에 적지 않고 런타임에 CSS 변수에서 읽는다.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const AllTokens: Story = {}
