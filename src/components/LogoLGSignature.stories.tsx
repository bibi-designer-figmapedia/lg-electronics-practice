import type { Meta, StoryObj } from '@storybook/react'
import { LogoLGSignature } from './LogoLGSignature'

const FIGMA_NODE_URL =
  'https://www.figma.com/design/Ma09rS3GL9ahAGRADSWDj3/?node-id=19649-32968'

const meta = {
  title: 'Components/Logo/LGSignature',
  component: LogoLGSignature,
  parameters: {
    layout: 'centered',
    // @storybook/addon-designs — the "Design" tab shows the Figma component.
    design: {
      type: 'figma',
      url: FIGMA_NODE_URL,
    },
  },
} satisfies Meta<typeof LogoLGSignature>

export default meta
type Story = StoryObj<typeof meta>

/** The only form in Figma: a single-color wordmark, no variants. */
export const Default: Story = {}
