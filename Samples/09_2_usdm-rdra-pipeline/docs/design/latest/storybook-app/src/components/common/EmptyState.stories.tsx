import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { EmptyState } from './EmptyState'

const meta: Meta<typeof EmptyState> = {
  title: 'Common/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof EmptyState>

export const Default: Story = {
  args: {
    icon: 'search',
    title: 'データが見つかりません',
    description: '検索条件を変更して再度お試しください。',
  },
}

export const WithAction: Story = {
  args: {
    icon: 'room',
    title: '会議室が登録されていません',
    description: '最初の会議室を登録して、貸し出しを開始しましょう。',
    action: {
      label: '会議室を登録する',
      variant: 'default',
    },
  },
}

export const NoResults: Story = {
  args: {
    icon: 'filter',
    title: '条件に一致する結果がありません',
    description: 'フィルター条件を変更してください。',
    action: {
      label: '条件をクリア',
      variant: 'outline',
    },
  },
}
