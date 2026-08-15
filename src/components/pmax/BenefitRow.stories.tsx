import type { Decorator, Meta, StoryObj } from '@storybook/react'
import { BenefitRow } from './BenefitRow'

/*
 * Figma "BenefitRow" (산출물 4).
 * component set 1-50, variant 는 tone 축 2개뿐이다 — white(1-51) · black(1-385).
 * 노드 링크와 토큰 매핑표는 ./BenefitRow.tsx 상단 주석에 있다.
 */

const FIGMA_NODE_URL =
  'https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=1-50'

/* tone=white 는 흰 라벨 + 흰 타일이라 밝은 지면에서는 읽히지 않는다. Figma 에서도
   배너 사진 위에 얹혀 있다. 어두운 지면을 깔아 확인만 하는 story 쪽 장치이며
   컴포넌트에는 배경이 없다. */
const InverseBackdrop: Decorator = (Story) => (
  <div className="bg-surface-inverse p-24">
    <Story />
  </div>
)

/* tone=black 이 Figma 세트에서 놓여 있는 지면과 같은 계열. */
const WarmBackdrop: Decorator = (Story) => (
  <div className="bg-bg-warm p-24">
    <Story />
  </div>
)

const meta = {
  title: 'Components/Pmax/BenefitRow',
  component: BenefitRow,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    // @storybook/addon-designs — the "Design" tab shows the Figma component set.
    design: {
      type: 'figma',
      url: FIGMA_NODE_URL,
    },
    docs: {
      description: {
        component: '혜택 아이콘과 2줄 라벨 쌍이 가로로 늘어선 한 줄.',
      },
    },
  },
} satisfies Meta<typeof BenefitRow>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Figma 세트의 첫 variant 이자 기본값. node-id=1-51
 *
 * 라벨과 타일이 모두 밝은 색이라 어두운 지면 위에서만 읽힌다 — Figma 에서도 배너 사진
 * 위에 얹혀 있다. 배경은 story 가 깐 것이고 컴포넌트에는 없다.
 */
export const White: Story = {
  args: { tone: 'white' },
  decorators: [InverseBackdrop],
}

/** node-id=1-385 */
export const Black: Story = {
  args: { tone: 'black' },
  decorators: [WarmBackdrop],
}

/**
 * 항목이 내용이라는 것을 보이는 story. Figma 원본 3개 대신 다른 혜택 2개를 넘긴다 —
 * 개수와 라벨이 바뀌어도 간격·정렬 규칙은 그대로다.
 */
export const CustomItems: Story = {
  args: {
    tone: 'black',
    items: [
      { icon: 'freeReturn', label: 'Free\nReturn' },
      { icon: 'twoYearWarranty', label: '2-Year\nWarranty' },
    ],
  },
  decorators: [WarmBackdrop],
}
