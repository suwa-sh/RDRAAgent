import type { Meta, StoryObj } from '@storybook/react'
import { EmptyState } from '../../components/common/EmptyState'

const meta: Meta<typeof EmptyState> = {
  title: 'Common/Feedback/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}
export default meta
type Story = StoryObj<typeof EmptyState>

export const Default: Story = {
  args: {
    title: '検索結果がありません',
    description: '条件を変更して再度検索してください。',
  },
}

export const WithAction: Story = {
  args: {
    title: '評価がまだありません',
    description: 'まだこの会議室への評価はありません。最初の評価を投稿してみましょう。',
    actionLabel: '評価を投稿する',
    onAction: () => alert('評価投稿画面へ遷移'),
  },
}
