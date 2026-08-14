import type { Meta, StoryObj } from '@storybook/react'
import { LogoLG } from './LogoLG'

const FIGMA_NODE_URL =
  'https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=1-22'

const meta = {
  title: 'Components/Logo/LG',
  component: LogoLG,
  parameters: {
    layout: 'centered',
    // @storybook/addon-designs — the "Design" tab shows the Figma component set
    // (Type=color / white / Black) next to the story.
    design: {
      type: 'figma',
      url: FIGMA_NODE_URL,
    },
  },
  args: {
    variant: 'color',
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['color', 'white', 'black'] },
  },
} satisfies Meta<typeof LogoLG>

export default meta
type Story = StoryObj<typeof meta>

/** `Type=color` — heritage-red symbol with the gray wordmark. */
export const Color: Story = {}

/** `Type=white` — for placement on a dark surface. */
export const White: Story = {
  args: { variant: 'white' },
  decorators: [
    (StoryFn) => (
      <div className="bg-surface-inverse p-24">
        <StoryFn />
      </div>
    ),
  ],
}

/** `Type=Black` — for placement on a light surface. */
export const Black: Story = {
  args: { variant: 'black' },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex items-center gap-24">
      <LogoLG variant="color" />
      <div className="bg-surface-inverse p-16">
        <LogoLG variant="white" />
      </div>
      <LogoLG variant="black" />
    </div>
  ),
}
