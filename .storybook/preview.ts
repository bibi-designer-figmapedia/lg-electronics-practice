import type { Preview } from '@storybook/react'
import '../src/index.css'

const preview: Preview = {
  // Storybook 8 enables autodocs per-component via tags; setting it here opts
  // every component in. Remove a component from autodocs with
  // `tags: ['!autodocs']` in its meta.
  tags: ['autodocs'],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
