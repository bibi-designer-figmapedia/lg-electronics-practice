import type { Meta, StoryObj } from '@storybook/react'
import { FuntionalTab, type FuntionalTabItemData } from './FuntionalTab'

/* 산출물 1 — Figma 원본. addon-designs 의 "Design" 탭이 이 노드를 띄운다. */
const FIGMA_NODE_URL =
  'https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-18858'

/** Figma 원본의 설명문. 7칸이 전부 같은 문구다. */
const DESCRIPTION = 'Nunc a tristique massa turpis justo turpis arcu.'

/**
 * Figma 원본(19661:18760)의 7칸을 배치 순서 그대로 옮긴 것이다.
 * 마지막 두 칸이 아이콘·라벨까지 똑같은 것도 원본 그대로다 — 임의로 고치지 않았다.
 */
const FIGMA_ITEMS: FuntionalTabItemData[] = [
  { icon: 'all', label: 'All', description: DESCRIPTION, href: '#', active: true },
  { icon: 'Refrigerator', label: 'Refrigerator', description: DESCRIPTION, href: '#' },
  { icon: 'BottomFreezer', label: 'Bottom Freezer', description: DESCRIPTION, href: '#' },
  { icon: 'MultiDoor', label: 'Multi Door', description: DESCRIPTION, href: '#' },
  { icon: 'SideBySide', label: 'Side by Side', description: DESCRIPTION, href: '#' },
  { icon: 'OneDoor', label: 'One Door', description: DESCRIPTION, href: '#' },
  { icon: 'OneDoor', label: 'One Door', description: DESCRIPTION, href: '#' },
]

const meta = {
  title: 'Components/FuntionalTab',
  component: FuntionalTab,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    design: {
      type: 'figma',
      url: FIGMA_NODE_URL,
    },
    docs: {
      description: {
        component: '`FuntionalTabItem` 을 한 줄로 늘어놓은 PLP 카테고리 필터 밴드.',
      },
    },
  },
  args: {
    items: FIGMA_ITEMS,
  },
} satisfies Meta<typeof FuntionalTab>

export default meta
type Story = StoryObj<typeof meta>

/** Figma 원본 그대로 — 7칸, 첫 칸이 active. */
export const Default: Story = {}

/** 화살표 핸들러를 연결한 경우. 핸들러가 없어도 버튼은 그대로 렌더된다. */
export const WithArrowHandlers: Story = {
  args: {
    onPrev: () => {},
    onNext: () => {},
  },
}

/** 선택된 칸이 가운데인 경우 — active 는 호출부가 정한다는 점을 보여준다. */
export const ActiveInMiddle: Story = {
  args: {
    items: FIGMA_ITEMS.map((item, index) => ({ ...item, active: index === 3 })),
  },
}
