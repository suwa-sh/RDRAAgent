import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ErrorBanner } from './ErrorBanner'

const meta: Meta<typeof ErrorBanner> = {
  title: 'Common/ErrorBanner',
  component: ErrorBanner,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof ErrorBanner>

export const Error: Story = {
  args: {
    message: 'データの取得に失敗しました。再度お試しください。',
    type: 'error',
  },
}

export const Warning: Story = {
  args: {
    message: 'セッションの有効期限が近づいています。',
    type: 'warning',
  },
}
