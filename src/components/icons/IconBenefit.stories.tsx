import type { Meta, StoryObj } from '@storybook/react'
import { IconBenefit, type IconBenefitType } from './IconBenefit'
import { BENEFIT_ICON_NAMES } from './IconBenefit.names'

const FIGMA_NODE_URL =
  'https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19620-23774'

/**
 * Figma component set 의 `Type` property 4값. 왼쪽이 Figma 원본 표기다.
 *
 * `onDark` 는 갤러리 섹션 배경을 뒤집는 플래그다. lineWhite 하나만 true 이고
 * 근거는 Gallery 주석의 실측 표에 있다 — 통일하기 전에 반드시 읽을 것.
 */
const TYPES: {
  value: IconBenefitType
  figmaLabel: string
  onDark?: boolean
}[] = [
  { value: 'lineBlack', figmaLabel: 'Line black' },
  { value: 'lineWhite', figmaLabel: 'Line white', onDark: true },
  { value: 'solidBlack', figmaLabel: 'Solid black' },
  { value: 'solidWhite', figmaLabel: 'Solid white' },
]

const TYPE_VALUES: IconBenefitType[] = TYPES.map((type) => type.value)

const meta = {
  title: 'Components/Icons/IconBenefit',
  component: IconBenefit,
  parameters: {
    layout: 'centered',
    // @storybook/addon-designs — the "Design" tab shows the Icon/Benefit component set.
    design: {
      type: 'figma',
      url: FIGMA_NODE_URL,
    },
  },
  args: {
    name: 'membership',
    type: 'lineBlack',
  },
  argTypes: {
    name: { control: 'select', options: [...BENEFIT_ICON_NAMES] },
    // Figma property 이름은 "Type" 이지만 원본값에 공백이 있어 camelCase 로 바꿨다.
    type: { control: 'select', options: TYPE_VALUES },
  },
} satisfies Meta<typeof IconBenefit>

export default meta
type Story = StoryObj<typeof meta>

/** 기본 story — controls 의 `name`(36) · `type`(4) 로 144 variant 를 전환한다. */
export const Default: Story = {}

/**
 * 144개 전부. Figma 의 Icon/Benefit component set 과 1:1 로 대조하는 용도다.
 * 한 화면에 144개를 평평하게 깔면 읽을 수 없어 Type 별 섹션 4개로 나눴다.
 *
 * ── 섹션 배경이 Type 마다 다르다. 통일하지 말 것 ──
 *
 * lineWhite 섹션만 `bg-surface-inverse`(어두운 회색)이고 나머지 3개는
 * `bg-bg-subtle` 이다. "일관성" 을 이유로 4개를 같은 배경으로 맞추면
 * 아래 둘 중 하나가 반드시 깨진다. 근거는 둘 다 렌더 픽셀 실측이다.
 *
 * 1. Solid 2개는 배경이 픽셀 값을 바꾼다 -> `bg-bg-subtle` 을 유지해야 한다.
 *    Solid 배경 path 에는 opacity 0.8 이 걸려 있어 아래 색이 비쳐 올라온다.
 *    배경을 바꿔 재측정하면 solidWhite 본체 픽셀의 77.6퍼센트가 달라지고,
 *    순백 픽셀 수는 어느 배경에서도 0이다 — 전 픽셀이 합성 결과라는 뜻이다.
 *    어두운 배경 위에서 solidWhite 칩은 (214,214,214) 회색이 되는데 Figma
 *    실측값은 (252,252,251) 이라 채널당 약 38 차이로 육안 식별된다.
 *    bg-subtle 위에서는 (253,253,251) 로 합성돼 Figma 와 채널당 1 이내로 맞는다.
 *    Figma 가 이 component set 을 깔아둔 캔버스 색도 (246,243,235) =
 *    `--lg-light-gray-1` = `--color-bg-subtle` 이라 같은 색이 곧 1:1 대조다.
 *
 * 2. Line white 는 배경이 픽셀 값을 바꾸지 않는다 -> 대비만 보고 고르면 된다.
 *    Line 획에는 opacity 합성이 없다. 배경을 바꿔 재측정하면 달라지는 픽셀은
 *    41.7퍼센트지만 전부 안티에일리어싱 경계이고, 순백 픽셀 수는 614 -> 614 로
 *    불변이다. 즉 배경을 어둡게 해도 글리프 충실도 손실이 0이다.
 *    그런데 `--color-icon-white` 획을 `--color-bg-subtle` 위에 두면 대비가
 *    1.11:1 로, WCAG 1.4.11(비텍스트 대비 3:1) 에 한참 못 미쳐 36개 variant 가
 *    사실상 보이지 않는다. `--color-surface-inverse` 위에서는 12.64:1 이다.
 *
 * 요약: Solid 는 배경이 데이터라서 못 바꾸고, Line 은 배경이 데이터가 아니라서
 * 접근성 기준으로 고른다. 두 섹션의 배경이 다른 것은 실수가 아니다.
 *
 * onDark 섹션은 제목·캡션도 `text-text-inverse` 로 뒤집는다. 그 배경 위에서
 * text-primary / text-secondary 는 각각 1.66:1, 1:1 이라 읽히지 않는다.
 */
export const Gallery: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div className="flex flex-col gap-48 p-32">
      {TYPES.map(({ value, figmaLabel, onDark }) => (
        <section
          key={value}
          className={`flex flex-col gap-24 rounded-12 p-24 ${
            onDark ? 'bg-surface-inverse' : 'bg-bg-subtle'
          }`}
        >
          {/* 갤러리 섹션 제목 — 기존 story 8개가 섹션 제목에 쓰는 합성 클래스와 같다. */}
          <h2
            className={`type-subtitle-medium-strong ${
              onDark ? 'text-text-inverse' : 'text-text-primary'
            }`}
          >
            Type={figmaLabel} — type=&quot;{value}&quot;
          </h2>
          <div className="grid grid-cols-6 gap-24">
            {BENEFIT_ICON_NAMES.map((name) => (
              <div key={name} className="flex flex-col items-center gap-8">
                <IconBenefit name={name} type={value} />
                {/* 캡션 라벨 — 기존 story 8개의 캡션 관례와 같다. */}
                <span
                  className={`type-body-small text-center ${
                    onDark ? 'text-text-inverse' : 'text-text-secondary'
                  }`}
                >
                  {name}
                </span>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  ),
}
