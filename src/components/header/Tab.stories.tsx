import type { Meta, StoryObj } from '@storybook/react'
import { Tab } from './Tab'

/* 산출물 1 — Figma 원본. addon-designs 의 "Design" 탭이 이 노드를 띄운다. */
const FIGMA_NODE_URL =
  'https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19643-31067'

const meta = {
  title: 'Components/Header/Tab',
  component: Tab,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: FIGMA_NODE_URL,
    },
    docs: {
      description: {
        component: '헤더 네비게이션 항목 1개.',
      },
    },
  },
  args: {
    children: 'Label',
    state: 'default',
    href: '#',
  },
  argTypes: {
    state: { control: 'inline-radio', options: ['default', 'active'] },
  },
} satisfies Meta<typeof Tab>

export default meta
type Story = StoryObj<typeof meta>

/** `state=default` — 밑줄이 불투명도 0 으로 숨는다. */
export const Default: Story = {}

/** `state=active` — brand/primary 밑줄 + `aria-current="page"`. */
export const Active: Story = {
  args: { state: 'active' },
}

/** Figma 세트의 2개 variant를 원본과 같은 순서로 나란히 둔다. */
export const AllStates: Story = {
  render: (args) => (
    <div className="flex items-center gap-40">
      {(['default', 'active'] as const).map((state) => (
        <Tab key={state} {...args} state={state}>
          Label
        </Tab>
      ))}
    </div>
  ),
}
