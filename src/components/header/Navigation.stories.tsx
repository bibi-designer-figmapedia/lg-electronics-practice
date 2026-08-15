import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, within } from '@storybook/test'
import type { CategoryMenuItem } from './CategoryMenu'
import { Navigation, type NavigationProps } from './Navigation'

/* 산출물 1 — Figma 원본. addon-designs 의 "Design" 탭이 이 노드를 띄운다. */
const FIGMA_NODE_URL =
  'https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-3947'

/*
 * 아래 두 상수는 새로 지어낸 값이 아니라 형제 story 에 이미 있는 값 그대로다
 * (HeaderNotification.stories.tsx 의 FIGMA_MESSAGE, HeaderGNB.stories.tsx 의 CATEGORY_ITEMS).
 * get_design_context(19661:3947) 로 확인한 결과 Navigation 안의 두 인스턴스는 문구를
 * override 하지 않았고 원본 컴포넌트의 기본값을 그대로 쓴다 — 그래서 같은 값이 맞다.
 */

/** Figma 텍스트 레이어(19661:4010)의 원문 그대로. 연속 공백도 원본에 있는 것이다. */
const FIGMA_MESSAGE =
  'Welcome to LG! Sign up and get a 5% discount on your first purchase!  Sign-up'

/** Header/GNB 인스턴스 안 CategoryMenu 의 라벨 6개. 첫 항목 Shop 만 밑줄이 보이는 active 다. */
const CATEGORY_ITEMS: CategoryMenuItem[] = [
  { label: 'Shop', href: '#', active: true },
  { label: 'TV/Audio/Video', href: '#' },
  { label: 'Appliances', href: '#' },
  { label: 'Air Solution', href: '#' },
  { label: 'Computer Products', href: '#' },
  { label: 'Support', href: '#' },
]

const meta = {
  title: 'Components/Header/Navigation',
  component: Navigation,
  parameters: {
    // 전체 폭 조합이라 캔버스 여백 없이 붙인다.
    layout: 'fullscreen',
    // @storybook/addon-designs — "Design" 탭이 Navigation 컴포넌트를 보여준다.
    design: {
      type: 'figma',
      url: FIGMA_NODE_URL,
    },
    docs: {
      description: {
        component: '`HeaderNotification` 과 `HeaderGNB` 를 세로로 쌓는 헤더 조합 레이어.',
      },
    },
  },
  args: {
    notification: FIGMA_MESSAGE,
    items: CATEGORY_ITEMS,
    /*
     * 두 자식으로 내려가는 핸들러 7개. RightMenu.stories.tsx 와 같은 방식으로 fn() 을 쓴다 —
     * Actions 패널에 호출이 그대로 찍히므로 두 단계를 건너간 위임이 실제로 도착하는지
     * 스토리에서 눈으로 확인된다.
     */
    notificationHandlers: {
      onPrev: fn(),
      onNext: fn(),
      onClose: fn(),
    },
    rightMenu: {
      onBusiness: fn(),
      onSearch: fn(),
      onGuest: fn(),
      onBag: fn(),
    },
  },
  argTypes: {
    notification: { control: 'text' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Navigation>

export default meta
type Story = StoryObj<typeof meta>

/** Figma 원본과 1:1 로 대조하는 기본 story. 내부 state 가 없어 다른 상태가 없다. */
export const Default: Story = {}

/*
 * 버튼 이름 → 그 버튼이 호출해야 하는 핸들러. 이름은 각 버튼의 접근 가능한 이름 그대로다
 * (알림 바 3개는 aria-label, "Business" 는 보이는 글자, 나머지 3개는 RightMenu 의 aria-label).
 * 즉 이 표는 스크린리더가 읽는 이름과 위임 대상을 한 줄에 붙여 놓은 것이다.
 */
const DELEGATION_TARGETS: {
  name: string
  pick: (args: NavigationProps) => (() => void) | undefined
}[] = [
  { name: 'Previous notification', pick: (args) => args.notificationHandlers?.onPrev },
  { name: 'Next notification', pick: (args) => args.notificationHandlers?.onNext },
  { name: 'Close notification', pick: (args) => args.notificationHandlers?.onClose },
  { name: 'Business', pick: (args) => args.rightMenu?.onBusiness },
  { name: 'Search', pick: (args) => args.rightMenu?.onSearch },
  { name: 'Guest', pick: (args) => args.rightMenu?.onGuest },
  { name: 'Shopping bag', pick: (args) => args.rightMenu?.onBag },
]

/**
 * 위임 경로 확인용. 모양이 다른 variant 가 아니라 `Default` 와 같은 것을 조작해 본 것이다 —
 * design-reviewer 가 잡은 FAIL 이 "초점은 받는데 누르면 아무 일도 없는 버튼 7개" 였고, 그것은
 * 렌더 결과만 봐서는 보이지 않기 때문이다. 버튼 7개를 차례로 눌러 각각의 핸들러가 정확히 한 번
 * 불리는지 확인한다. 통과 경로 중 하나라도 끊기면(예: `HeaderGNB` 가 `rightMenu` 를 넘기지
 * 않으면) 이 스토리가 실패한다.
 */
export const DelegatesHandlers: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    for (const { name, pick } of DELEGATION_TARGETS) {
      await userEvent.click(canvas.getByRole('button', { name }))
      await expect(pick(args)).toHaveBeenCalledTimes(1)
    }
  },
}
