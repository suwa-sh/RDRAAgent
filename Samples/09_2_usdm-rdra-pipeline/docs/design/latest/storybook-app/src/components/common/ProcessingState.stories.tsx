import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ProcessingState } from './ProcessingState'

const meta: Meta<typeof ProcessingState> = {
  title: 'Common/ProcessingState',
  component: ProcessingState,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof ProcessingState>

export const Default: Story = {
  args: {
    title: '精算処理を実行中',
    description: '処理が完了するまでしばらくお待ちください。',
  },
}

export const WithProgress: Story = {
  args: {
    title: 'データを処理中',
    description: '3/10件の精算を処理しています。',
    progress: 30,
  },
}
