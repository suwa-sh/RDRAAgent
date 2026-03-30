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
          { value: 'user', title: '利用者' },
          { value: 'owner', title: 'オーナー' },
          { value: 'admin', title: '管理者' },
        ],
        dynamicTitle: true,
      },
    },
    theme: {
      description: 'テーマ切替',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
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
      document.documentElement.classList.toggle('light', theme === 'light')

      document.body.style.background = 'var(--background)'
      document.body.style.color = 'var(--foreground)'

      return Story()
    },
  ],
}

export default preview
