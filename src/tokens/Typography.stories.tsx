import { useEffect, useRef, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { useCssVars } from './tokenValues'

/*
 * Typography gallery — two sections, mirroring how the token file is split.
 *
 *   1. Text styles: the `@utility type-*` composites. A Figma text style sets
 *      family + size + weight + line-height at once, which a single custom
 *      property cannot hold, so these are classes rather than variables.
 *      Their applied values are read back off the rendered sample element.
 *   2. Atoms: the `@theme` font-size steps Figma exposes as variables, read
 *      from the custom properties directly.
 *
 * Nothing is printed from a literal in this file — the samples report what the
 * browser actually resolved, so a token change shows up here immediately.
 */

const FIGMA_TOKENS_URL =
  'https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19561-25592'

const SAMPLE = '가나다라 ABC 0123'

/** [Figma text style, utility class] */
type TextStyle = readonly [figmaStyle: string, utility: string]

const TEXT_STYLES: readonly TextStyle[] = [
  ['title/xlarge', 'type-title-xlarge'],
  ['title/large', 'type-title-large'],
  ['title/medium', 'type-title-medium'],
  ['title/small', 'type-title-small'],
  ['subtitle/large', 'type-subtitle-large'],
  ['subtitle/medium', 'type-subtitle-medium'],
  ['subtitle/medium-strong', 'type-subtitle-medium-strong'],
  ['body/default', 'type-body-default'],
  ['body/default-strong', 'type-body-default-strong'],
  ['body/small', 'type-body-small'],
  ['cta/medium', 'type-cta-medium'],
  ['nav/menu', 'type-nav-menu'],
  ['badge/small', 'type-badge-small'],
]

/** [custom property, font-size utility] */
type SizeStep = readonly [variable: string, utility: string]

const SIZE_STEPS: readonly SizeStep[] = [
  ['--text-12', 'text-12'],
  ['--text-14', 'text-14'],
  ['--text-16', 'text-16'],
  ['--text-20', 'text-20'],
  ['--text-24', 'text-24'],
  ['--text-32', 'text-32'],
  ['--text-36', 'text-36'],
  ['--text-56', 'text-56'],
  ['--text-60', 'text-60'],
  ['--text-80', 'text-80'],
]

const ATOM_NAMES = [
  ...SIZE_STEPS.map(([variable]) => variable),
  '--font-weight-regular',
  '--font-weight-semibold',
  '--font-headline',
  '--font-text',
]

/** What the browser ended up applying to one sample line. */
function useAppliedType(ref: React.RefObject<HTMLElement | null>) {
  const [applied, setApplied] = useState('')

  useEffect(() => {
    if (!ref.current) return
    const style = getComputedStyle(ref.current)
    setApplied(`size ${style.fontSize} · line ${style.lineHeight} · weight ${style.fontWeight}`)
  }, [ref])

  return applied
}

function StyleRow({ figmaStyle, utility }: { figmaStyle: string; utility: string }) {
  const sampleRef = useRef<HTMLParagraphElement>(null)
  const applied = useAppliedType(sampleRef)

  return (
    <div className="border-t border-border-default py-16">
      <div className="flex flex-wrap items-baseline gap-12">
        <code className="type-body-default-strong">{utility}</code>
        <span className="type-body-small text-text-tertiary">
          Figma {figmaStyle} · {applied || '—'}
        </span>
      </div>
      <p ref={sampleRef} className={`mt-8 ${utility}`}>
        {SAMPLE}
      </p>
    </div>
  )
}

function TypographyGallery() {
  const atoms = useCssVars(ATOM_NAMES)

  return (
    <div className="bg-bg-default p-24 text-text-primary">
      <h1 className="type-title-small">Typography</h1>
      <p className="type-body-default mt-8 text-text-tertiary">
        텍스트 스타일 {TEXT_STYLES.length}개는 유틸리티 클래스, 폰트 크기{' '}
        {SIZE_STEPS.length}개는 변수다. Figma 텍스트 스타일은 family·size·weight·
        line-height 를 한 번에 정하는 복합값이라 변수 하나에 담기지 않는다 —
        type-* 를 쓰면 Figma 스타일을 그대로 재현하고, text-* 와 font-* 를 손으로
        조합하면 어긋날 수 있다.
      </p>
      <p className="type-body-small mt-8 text-text-tertiary">
        패밀리는 2개다. --font-headline 은 {atoms['--font-headline'] || '—'} 이고
        --font-text 는 {atoms['--font-text'] || '—'} 다. Figma 가 font-family/sans
        하나를 이 둘로 쪼갰고, 갈라지는 자리는 정확히 title/* 4개(headline) 대
        나머지 9개(text)다. 이름 뒤의 폴백 체인은 Figma 것이 아니라 웹폰트를 못
        받았을 때를 위해 코드에서 붙인 것이다.
      </p>
      <p className="type-body-small mt-8 text-text-tertiary">
        LG EI 는 npm 에 없는 LG 전용 폰트라 public/fonts/ 에서 self-host 한다(6개
        페이스 = 2 패밀리 × Regular·SemiBold·Bold). 저장소가 공개라 .otf 파일은
        커밋되지 않으므로, 파일을 넣지 않은 환경에서는 아래 샘플이 폴백 폰트로
        렌더된다 — 크기·굵기·행간은 맞지만 글자 모양과 지표는 Figma 원본이 아니다.
        받는 방법은 루트 README.md 에 있다. 지금 보고 있는 것이 실제 LG EI 인지는
        브라우저 개발자도구의 Computed → Rendered Fonts 로 확인할 수 있다.
      </p>

      <section className="mt-32">
        <h2 className="type-subtitle-medium-strong">텍스트 스타일</h2>
        <div className="mt-8">
          {TEXT_STYLES.map(([figmaStyle, utility]) => (
            <StyleRow key={utility} figmaStyle={figmaStyle} utility={utility} />
          ))}
        </div>
      </section>

      <section className="mt-40">
        <h2 className="type-subtitle-medium-strong">폰트 크기 스케일</h2>
        <p className="type-body-small mt-4 text-text-tertiary">
          Figma font-size/* 변수 10개 전부. 복합 스타일 없이 크기만 필요할 때 쓴다.
          변수가 있다는 것과 텍스트 스타일이 그 변수를 참조한다는 것은 다르다 —
          title/xlarge 와 body/small 은 Figma 쪽에서 크기(80 · 14)를 변수 대신 값으로
          직접 적고 있어서, 두 곳을 손으로 맞춰야 한다.
        </p>
        <div className="mt-16 flex flex-col gap-12">
          {SIZE_STEPS.map(([variable, utility]) => (
            <div key={variable} className="flex flex-wrap items-baseline gap-12">
              <code className="type-body-default-strong w-64 shrink-0">{utility}</code>
              <span className="type-body-small w-64 shrink-0 text-text-tertiary">
                {atoms[variable] || '—'}
              </span>
              <span className={utility}>{SAMPLE}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-40">
        <h2 className="type-subtitle-medium-strong">폰트 굵기</h2>
        <div className="mt-16 flex flex-col gap-8">
          <span className="type-body-small text-text-tertiary">
            --font-weight-regular = {atoms['--font-weight-regular'] || '—'} ·
            --font-weight-semibold = {atoms['--font-weight-semibold'] || '—'}
          </span>
          <span className="type-body-default">{SAMPLE} — regular</span>
          <span className="type-body-default-strong">{SAMPLE} — semibold</span>
        </div>
      </section>
    </div>
  )
}

const meta: Meta<typeof TypographyGallery> = {
  title: 'Design Tokens/Typography',
  component: TypographyGallery,
  parameters: {
    layout: 'fullscreen',
    design: { type: 'figma', url: FIGMA_TOKENS_URL },
    docs: {
      description: {
        component:
          'src/tokens/typography.tokens.css 의 텍스트 스타일과 폰트 크기. 표시되는 값은 실제 렌더 결과에서 읽는다.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const AllStyles: Story = {}
