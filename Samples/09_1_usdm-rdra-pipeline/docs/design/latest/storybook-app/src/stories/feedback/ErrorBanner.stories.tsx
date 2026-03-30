import type { Meta, StoryObj } from '@storybook/react'
import { ErrorBanner } from '../../components/common/ErrorBanner'

const meta: Meta<typeof ErrorBanner> = {
  title: 'Common/Feedback/ErrorBanner',
  component: ErrorBanner,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof ErrorBanner>

export const Default: Story = {
  args: {
    message: 'データの取得に失敗しました。',
  },
}

export const WithRetry: Story = {
  args: {
    message: 'ネットワークエラーが発生しました。',
    onRetry: () => alert('再試行'),
  },
}
