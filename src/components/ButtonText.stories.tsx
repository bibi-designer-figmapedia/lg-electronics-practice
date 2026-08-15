import type { Meta, StoryObj } from '@storybook/react'
import { ButtonText } from './ButtonText'

const FIGMA_NODE_URL =
  'https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-3700'

const meta = {
  title: 'Components/ButtonText',
  component: ButtonText,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    // @storybook/addon-designs — "Design" 탭에 Button/Text 컴포넌트 세트를 띄운다.
    design: {
      type: 'figma',
      url: FIGMA_NODE_URL,
    },
    docs: {
      description: {
        component: '텍스트 라벨과 오른쪽 chevron 만으로 된 링크형 버튼.',
      },
    },
  },
  args: {
    children: 'Read More',
  },
} satisfies Meta<typeof ButtonText>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Figma `state=default`. 커서를 올리면 `state=hover` 가 된다 — 밑줄이 나타나면서
 * 버튼 높이가 늘어난다.
 */
export const Default: Story = {}
