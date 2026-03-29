import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ProcessingState } from '@/components/common/ProcessingState'

const meta = {
  title: 'Common/ProcessingState',
  component: ProcessingState,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    status: { control: 'radio', options: ['processing', 'completed', 'failed'] },
  },
} satisfies Meta<typeof ProcessingState>

export default meta
type Story = StoryObj<typeof meta>

export const Processing: Story = {
  args: {
    status: 'processing',
    title: '予約を処理中です',
    description: 'しばらくお待ちください。この処理には数秒かかる場合があります。',
  },
}

export const Completed: Story = {
  args: {
    status: 'completed',
    title: '予約が完了しました',
    description: '確認メールを登録済みのメールアドレスに送信しました。',
  },
}

export const Failed: Story = {
  args: {
    status: 'failed',
    title: '予約に失敗しました',
    description: '通信エラーが発生しました。しばらく時間をおいてから再試行してください。',
    onRetry: () => {},
  },
}
