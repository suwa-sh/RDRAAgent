import type { Preview } from '@storybook/nextjs-vite'
import '../src/app/globals.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
  globalTypes: {
    portal: {
      description: 'ポータル切替',
      toolbar: {
        title: 'Portal',
        icon: 'user',
        items: [
          { value: 'user', title: '利用者', icon: 'user' },
          { value: 'owner', title: 'オーナー', icon: 'key' },
          { value: 'admin', title: '管理者', icon: 'shield' },
        ],
        dynamicTitle: true,
      },
    },
    theme: {
      description: 'テーマ切替',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    portal: 'user',
    theme: 'light',
  },
  decorators: [
    (Story, context) => {
      const portal = context.globals.portal || 'user'
      const theme = context.globals.theme || 'light'

      document.documentElement.setAttribute('data-portal', portal)
      document.documentElement.classList.toggle('dark', theme === 'dark')
      document.body.style.background = 'var(--background)'
      document.body.style.color = 'var(--foreground)'

      return Story()
    },
  ],
}

export default preview
