import type { Meta, StoryObj } from '@storybook/react'
import { FuntionalTabItem } from './FuntionalTabItem'

/* 산출물 1 — Figma 원본. addon-designs 의 "Design" 탭이 이 노드를 띄운다. */
const FIGMA_NODE_URL =
  'https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-19907'

/** Figma 원본의 설명문. 7칸이 전부 같은 문구다. */
const DESCRIPTION = 'Nunc a tristique massa turpis justo turpis arcu.'

const meta = {
  title: 'Components/FuntionalTabItem',
  component: FuntionalTabItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: FIGMA_NODE_URL,
    },
    docs: {
      description: {
        component: '아이콘 · 라벨 · 설명문으로 이뤄진 PLP 카테고리 필터 탭 1칸.',
      },
    },
  },
  args: {
    icon: 'all',
    label: 'All',
    description: DESCRIPTION,
    state: 'default',
    href: '#',
  },
  argTypes: {
    state: { control: 'inline-radio', options: ['default', 'active'] },
    icon: {
      control: 'select',
      options: ['all', 'Refrigerator', 'BottomFreezer', 'MultiDoor', 'SideBySide', 'OneDoor'],
    },
  },
} satisfies Meta<typeof FuntionalTabItem>

export default meta
type Story = StoryObj<typeof meta>

/** `state=default` — 밑줄이 없고 아이콘은 icon/default 다. */
export const Default: Story = {}

/** `state=active` — icon/active 아이콘 + state/error 밑줄 + `aria-current="page"`. */
export const Active: Story = {
  args: { state: 'active' },
}

/**
 * Figma 프레임(19661:19907)의 배치 그대로 — 왼쪽 active, 오른쪽 default.
 * 두 칸의 높이가 다르고 윗변이 맞는다는 점을 확인하는 story 다.
 */
export const AllStates: Story = {
  render: (args) => (
    <div className="flex items-start gap-24">
      <FuntionalTabItem {...args} state="active" />
      <FuntionalTabItem {...args} state="default" />
    </div>
  ),
}
