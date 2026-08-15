import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, within } from '@storybook/test'
import { RightMenu } from './RightMenu'

/* 산출물 1 — Figma 원본. addon-designs 의 "Design" 탭이 이 노드를 띄운다. */
const FIGMA_NODE_URL =
  'https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-4412'

const meta = {
  title: 'Components/Header/RightMenu',
  component: RightMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: FIGMA_NODE_URL,
    },
    docs: {
      description: {
        component: '워드마크 · Business 버튼 · 유틸리티 아이콘 3개로 된 헤더 오른쪽 묶음.',
      },
    },
  },
  /*
   * 핸들러 4개를 전부 넘긴다. fn() 이라 Actions 패널에 호출이 그대로 찍히고, 죽은 정지점이
   * 아니라는 것이 스토리에서 바로 확인된다.
   */
  args: {
    onBusiness: fn(),
    onSearch: fn(),
    onGuest: fn(),
    onBag: fn(),
  },
} satisfies Meta<typeof RightMenu>

export default meta
type Story = StoryObj<typeof meta>

/** Figma 에 있는 유일한 형태. variant 축이 없어 모양을 보여주는 스토리는 이것 하나다. */
export const Default: Story = {}

/**
 * 포커스 표시 확인용. 모양이 다른 variant 가 아니라 Default 와 같은 것을 키보드 상태로
 * 놓은 것이다 — 마우스 클릭으로는 `:focus-visible` 이 붙지 않아 눈으로 볼 수 없기 때문에
 * Tab 을 실제로 눌러 첫 버튼("Business")에 초점을 옮긴다. 워드마크는 초점을 받지 않으므로
 * 한 번이면 닿는다. 이어서 Tab 을 더 누르면 아이콘 버튼 3개에서도 같은 outline 이 보인다.
 */
export const FocusVisible: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.tab()
    await expect(canvas.getByRole('button', { name: 'Business' })).toHaveFocus()
  },
}
