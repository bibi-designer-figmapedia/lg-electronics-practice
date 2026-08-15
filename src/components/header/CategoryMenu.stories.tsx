import type { Meta, StoryObj } from '@storybook/react'
import { CategoryMenu, type CategoryMenuItem } from './CategoryMenu'

/* 산출물 1 — Figma 원본. addon-designs 의 "Design" 탭이 이 노드를 띄운다. */
const FIGMA_NODE_URL =
  'https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-3412'

/* layout=FillWidth(19661:3411)의 실제 라벨 8개. get_design_context 로 읽은 문구·순서 그대로이며
   첫 항목 Kitchen 만 state=active 다. */
const FILL_WIDTH_ITEMS: CategoryMenuItem[] = [
  { label: 'Kitchen', href: '#', active: true },
  { label: 'Living', href: '#' },
  { label: 'Laundry', href: '#' },
  { label: 'Air Care', href: '#' },
  { label: 'TV', href: '#' },
  { label: 'Audio', href: '#' },
  { label: 'Computer', href: '#' },
  { label: 'Support', href: '#' },
]

/* layout=LeftMenu(19655:33598)는 탭 6개가 모두 자리표시 문구 "Label" 이고 active 가 없다. */
const LEFT_MENU_ITEMS: CategoryMenuItem[] = Array.from({ length: 6 }, () => ({
  label: 'Label',
  href: '#',
}))

const meta = {
  title: 'Components/Header/CategoryMenu',
  component: CategoryMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    design: {
      type: 'figma',
      url: FIGMA_NODE_URL,
    },
    docs: {
      description: {
        component: '`Tab` 을 한 줄로 늘어놓은 카테고리 네비게이션.',
      },
    },
  },
  args: {
    layout: 'fillWidth',
    items: FILL_WIDTH_ITEMS,
  },
  argTypes: {
    layout: { control: 'inline-radio', options: ['fillWidth', 'leftMenu'] },
  },
} satisfies Meta<typeof CategoryMenu>

export default meta
type Story = StoryObj<typeof meta>

/** `layout=FillWidth` — 실제 카테고리 라벨 8개, 첫 항목이 active. */
export const FillWidth: Story = {}

/** `layout=LeftMenu` — Figma 와 같은 자리표시 라벨 6개, active 없음. */
export const LeftMenu: Story = {
  args: {
    layout: 'leftMenu',
    items: LEFT_MENU_ITEMS,
  },
}

/** Figma 세트의 2개 variant 를 원본과 같은 세로 순서로 둔다. */
export const AllLayouts: Story = {
  render: (args) => (
    <div className="flex flex-col gap-40">
      <CategoryMenu {...args} layout="fillWidth" items={FILL_WIDTH_ITEMS} />
      <CategoryMenu {...args} layout="leftMenu" items={LEFT_MENU_ITEMS} />
    </div>
  ),
}
