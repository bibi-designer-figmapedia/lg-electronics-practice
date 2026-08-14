import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    // @storybook/addon-designs — paste a Figma frame/file URL here to show the
    // design side by side with the story in the "Design" tab.
    // design: {
    //   type: 'figma',
    //   url: 'https://www.figma.com/design/<file-key>/<name>?node-id=<node-id>',
    // },
  },
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'md',
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {}

export const Secondary: Story = {
  args: { variant: 'secondary' },
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
  ),
}

export const Disabled: Story = {
  args: { disabled: true },
}
