import type { Meta, StoryObj } from '@storybook/react'
import { HeaderNotification } from './HeaderNotification'

const FIGMA_NODE_URL =
  'https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-4208'

/**
 * Figma 텍스트 레이어(19661:4010)의 원문 그대로. 느낌표와 "Sign-up" 사이의 연속 공백도
 * 원본에 있는 것이라 지우지 않았다 — 브라우저가 한 칸으로 접는다(컴포넌트 주석 참고).
 */
const FIGMA_MESSAGE =
  'Welcome to LG! Sign up and get a 5% discount on your first purchase!  Sign-up'

const meta = {
  title: 'Components/Header/HeaderNotification',
  component: HeaderNotification,
  parameters: {
    // 전체 폭 바라서 캔버스 여백 없이 붙인다.
    layout: 'fullscreen',
    // @storybook/addon-designs — the "Design" tab shows the Header/Notification component.
    design: {
      type: 'figma',
      url: FIGMA_NODE_URL,
    },
  },
  args: {
    children: FIGMA_MESSAGE,
  },
  argTypes: {
    children: { control: 'text' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof HeaderNotification>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Figma 원본과 1:1 로 대조하는 기본 story. 핸들러를 주지 않아도 버튼 3개는 그대로
 * 렌더된다 — 이 컴포넌트는 상태를 갖지 않고, 닫힘 여부는 호출부의 관심사다.
 */
export const Default: Story = {}
