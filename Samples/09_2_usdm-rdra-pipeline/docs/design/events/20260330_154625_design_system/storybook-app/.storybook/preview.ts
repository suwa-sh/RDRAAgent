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
      description: 'Portal selector',
      toolbar: {
        title: 'Portal',
        icon: 'user',
        items: [
          { value: 'user', title: 'User (利用者)' },
          { value: 'owner', title: 'Owner (オーナー)' },
          { value: 'admin', title: 'Admin (管理者)' },
        ],
        dynamicTitle: true,
      },
    },
    theme: {
      description: 'Theme selector',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
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
      if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light')
      } else {
        document.documentElement.removeAttribute('data-theme')
      }

      document.body.style.background = 'var(--background)'
      document.body.style.color = 'var(--foreground)'

      return Story()
    },
  ],
}

export default preview
