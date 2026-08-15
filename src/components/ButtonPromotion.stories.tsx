import type { Decorator, Meta, StoryObj } from '@storybook/react'
import { ButtonPromotion } from './ButtonPromotion'

/*
 * Figma "Button/Promotion" (산출물 4).
 * 컴포넌트 세트 1-15, variant 는 color 축 3개뿐이다 — red · black · white.
 * 노드 링크와 토큰 매핑표는 ./ButtonPromotion.tsx 상단 주석에 있다.
 */

const FIGMA_NODE_URL =
  'https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=1-15'

/* Figma 세트의 지면색과 같은 계열의 토큰. white variant 가 흰 배경에 묻히는 것을
   확인용으로 방지한다 — 컴포넌트가 아니라 story 쪽 장치다. */
const WarmBackdrop: Decorator = (Story) => (
  <div className="bg-bg-warm p-24">
    <Story />
  </div>
)

const meta = {
  title: 'Components/ButtonPromotion',
  component: ButtonPromotion,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    // @storybook/addon-designs — the "Design" tab shows the Figma component set.
    design: {
      type: 'figma',
      url: FIGMA_NODE_URL,
    },
  },
  args: {
    children: 'Shop now',
  },
} satisfies Meta<typeof ButtonPromotion>

export default meta
type Story = StoryObj<typeof meta>

/** Figma 가 "Red (default)" 로 표기한 기본값. node-id=1-16 */
export const Red: Story = {
  args: { color: 'red' },
}

/** node-id=1-18 */
export const Black: Story = {
  args: { color: 'black' },
}

/**
 * node-id=1-20. Figma 에 테두리가 없어 흰 지면에서는 경계가 보이지 않는다.
 * 임의로 테두리를 넣는 대신 배경을 깔아 확인한다.
 */
export const White: Story = {
  args: { color: 'white' },
  decorators: [WarmBackdrop],
}
