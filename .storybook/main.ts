import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  // Serves public/ at the root, which is what makes the `url('/fonts/...')` in
  // src/index.css resolve inside Storybook. Vite does this for dev and build on
  // its own; Storybook does not, so without this line the LG EI faces 404 and
  // every story silently renders in the fallback font.
  staticDirs: ['../public'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-designs',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    defaultName: 'Docs',
  },
  typescript: {
    // Pull prop tables from the TS types so autodocs pages stay in sync.
    reactDocgen: 'react-docgen-typescript',
  },
}

export default config
