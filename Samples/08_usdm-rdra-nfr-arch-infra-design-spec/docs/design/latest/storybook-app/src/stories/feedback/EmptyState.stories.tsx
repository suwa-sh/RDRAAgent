import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { EmptyState } from '@/components/common/EmptyState'
import { Icon } from '@/components/ui/Icon'

const meta = {
  title: 'Common/EmptyState',
  component: EmptyState,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof EmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'データがありません',
  },
}

export const WithDescription: Story = {
  args: {
    title: '会議室が見つかりません',
    description: '条件に一致する会議室はありませんでした。検索条件を変更してお試しください。',
  },
}

export const WithAction: Story = {
  args: {
    title: '予約がありません',
    description: 'まだ予約がありません。会議室を探して最初の予約をしましょう。',
    action: {
      label: '会議室を探す',
      onClick: () => {},
    },
  },
}

export const WithIcon: Story = {
  args: {
    icon: <Icon name="room" size={48} />,
    title: '会議室が登録されていません',
    description: 'オーナーがまだ会議室を登録していません。',
  },
}

export const SearchNoResults: Story = {
  args: {
    icon: <Icon name="search" size={48} />,
    title: '検索結果がありません',
    description: '「渋谷 大会議室」に一致する会議室は見つかりませんでした。別のキーワードをお試しください。',
    action: {
      label: '検索をリセット',
      onClick: () => {},
    },
  },
}
