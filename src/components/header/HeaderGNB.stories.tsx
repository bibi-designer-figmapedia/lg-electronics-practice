import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { HeaderGNB } from './HeaderGNB'
import type { CategoryMenuItem } from './CategoryMenu'

/* 산출물 1 — Figma 원본(component set). addon-designs 의 "Design" 탭이 이 노드를 띄운다. */
const FIGMA_NODE_URL =
  'https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-3966'

/*
 * Property 1=Default(19643:30719) 안의 CategoryMenu 인스턴스(19655:33694)가 실제로 갖고 있는
 * 라벨 6개다. get_design_context 로 읽은 문구와 순서 그대로이며, 첫 항목 Shop 만 밑줄이
 * 보이는 state=active 다(나머지 5개는 같은 밑줄 사각형을 투명도 0 으로 숨기고 있다).
 *
 * href 는 Figma 에 목적지가 없어 자리표시자다 — 문서 페이지에서 탭이 실제 링크로 렌더되는지
 * 보이기 위한 값이고, 호출부는 진짜 경로를 넘긴다.
 */
const CATEGORY_ITEMS: CategoryMenuItem[] = [
  { label: 'Shop', href: '#', active: true },
  { label: 'TV/Audio/Video', href: '#' },
  { label: 'Appliances', href: '#' },
  { label: 'Air Solution', href: '#' },
  { label: 'Computer Products', href: '#' },
  { label: 'Support', href: '#' },
]

const meta = {
  title: 'Components/Header/HeaderGNB',
  component: HeaderGNB,
  parameters: {
    // 전체 폭 바라서 캔버스 여백 없이 붙인다.
    layout: 'fullscreen',
    // @storybook/addon-designs — "Design" 탭이 Header/GNB 컴포넌트 세트를 보여준다.
    design: {
      type: 'figma',
      url: FIGMA_NODE_URL,
    },
    docs: {
      description: {
        component: '로고 · 카테고리 메뉴 · 오른쪽 유틸리티로 된 최상단 글로벌 네비게이션 바.',
      },
    },
  },
  args: {
    variant: 'default',
    items: CATEGORY_ITEMS,
    /*
     * RightMenu 로 내려가는 핸들러 4개. RightMenu.stories.tsx 와 같은 방식으로 fn() 을 쓴다 —
     * Actions 패널에 호출이 그대로 찍히므로, 통과 경로가 실제로 이어졌는지 스토리에서 바로
     * 확인된다(죽은 정지점이 아니라는 증거다).
     */
    rightMenu: {
      onBusiness: fn(),
      onSearch: fn(),
      onGuest: fn(),
      onBag: fn(),
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'secondary'] },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof HeaderGNB>

export default meta
type Story = StoryObj<typeof meta>

/** `Property 1=Default` — Figma 원본의 카테고리 라벨 6개, 첫 항목이 active. */
export const Default: Story = {}

/** `Property 1=secondary` — 로고만 남은 축소형. `items` 는 이 variant 에서 쓰이지 않는다. */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
}

/** Figma 세트의 2개 variant 를 원본과 같은 세로 순서(secondary 가 위)로 둔다. */
export const AllVariants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-40">
      <HeaderGNB {...args} variant="secondary" />
      <HeaderGNB {...args} variant="default" />
    </div>
  ),
}
