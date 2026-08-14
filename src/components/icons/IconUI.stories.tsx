import type { Meta, StoryObj } from '@storybook/react'
import { IconUI, type IconUIType } from './IconUI'

const FIGMA_NODE_URL =
  'https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19655-33764'

/** Figma component set 의 variant 순서 그대로. */
const TYPES: IconUIType[] = [
  'arrowLeft',
  'arrowRight',
  'bag',
  'Search',
  'Arrow',
  'Crossup',
  'guest',
  'close',
]

const meta = {
  title: 'Components/Icons/IconUI',
  component: IconUI,
  parameters: {
    layout: 'centered',
    // @storybook/addon-designs — the "Design" tab shows the Icon/UI component set.
    design: {
      type: 'figma',
      url: FIGMA_NODE_URL,
    },
  },
  args: {
    type: 'Arrow',
  },
  argTypes: {
    type: { control: 'select', options: TYPES },
  },
} satisfies Meta<typeof IconUI>

export default meta
type Story = StoryObj<typeof meta>

/** 기본 story — controls 의 `type` 으로 8개 variant 를 전환한다. */
export const Default: Story = {}

/** 8개 variant 전부. Figma 의 Icon/UI 프레임과 1:1 로 대조하는 용도다. */
export const Gallery: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-24">
      {TYPES.map((type) => (
        <div key={type} className="flex flex-col items-center gap-8">
          <IconUI type={type} />
          {/* 캡션 라벨 — 기존 story 의 캡션 관례와 같은 합성 클래스다. */}
          <span className="type-body-small text-text-secondary">{type}</span>
        </div>
      ))}
    </div>
  ),
}
