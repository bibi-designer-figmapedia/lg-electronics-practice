import type { Meta, StoryObj } from '@storybook/react'
import { IconPLP, type IconPLPName } from './IconPLP'

const FIGMA_NODE_URL =
  'https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19661-19851'

/** Figma component set 의 variant 순서 그대로. */
const NAMES: IconPLPName[] = [
  'OneDoor',
  'MultiDoor',
  'Refrigerator',
  'BottomFreezer',
  'all',
  'SideBySide',
]

const meta = {
  title: 'Components/Icons/IconPLP',
  component: IconPLP,
  parameters: {
    layout: 'centered',
    // @storybook/addon-designs — the "Design" tab shows the Icon/PLP component set.
    design: {
      type: 'figma',
      url: FIGMA_NODE_URL,
    },
  },
  args: {
    name: 'all',
  },
  argTypes: {
    // Figma property 이름은 "Property 1" 이지만 공백 때문에 prop 으로 쓸 수 없어 `name`.
    name: { control: 'select', options: NAMES },
  },
} satisfies Meta<typeof IconPLP>

export default meta
type Story = StoryObj<typeof meta>

/** 기본 story — controls 의 `name` 으로 6개 variant 를 전환한다. */
export const Default: Story = {}

/** 6개 variant 전부. Figma 의 Icon/PLP 프레임과 1:1 로 대조하는 용도다. */
export const Gallery: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-24">
      {NAMES.map((name) => (
        <div key={name} className="flex flex-col items-center gap-8">
          <IconPLP name={name} />
          <span className="text-12 text-text-secondary">{name}</span>
        </div>
      ))}
    </div>
  ),
}
