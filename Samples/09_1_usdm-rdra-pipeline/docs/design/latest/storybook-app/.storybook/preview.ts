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
      name: 'Portal',
      description: 'Switch portal theme',
      defaultValue: 'user',
      toolbar: {
        icon: 'users',
        items: [
          { value: 'user', title: 'User (利用者)' },
          { value: 'owner', title: 'Owner (提供者)' },
          { value: 'admin', title: 'Admin (管理者)' },
        ],
        dynamicTitle: true,
      },
    },
    theme: {
      name: 'Theme',
      description: 'Switch light/dark theme',
      defaultValue: 'light',
      toolbar: {
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const portal = (context.globals as Record<string, string>).portal || 'user'
      const theme = (context.globals as Record<string, string>).theme || 'light'

      document.documentElement.setAttribute('data-portal', portal)
      document.documentElement.classList.toggle('dark', theme === 'dark')
      document.documentElement.classList.toggle('light', theme === 'light')

      // Required: set body background/color for theme switching
      document.body.style.background = 'var(--background)'
      document.body.style.color = 'var(--foreground)'

      return Story()
    },
  ],
}

export default preview
