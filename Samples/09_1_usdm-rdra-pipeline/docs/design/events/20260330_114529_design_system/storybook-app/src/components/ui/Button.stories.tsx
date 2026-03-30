import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'outline', 'ghost', 'destructive'],
    },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = { args: { children: '予約する', variant: 'default' } }
export const Secondary: Story = { args: { children: '戻る', variant: 'secondary' } }
export const Outline: Story = { args: { children: 'フィルター', variant: 'outline' } }
export const Ghost: Story = { args: { children: '詳細を見る', variant: 'ghost' } }
export const Destructive: Story = { args: { children: '取り消す', variant: 'destructive' } }
export const Small: Story = { args: { children: '編集', variant: 'default', size: 'sm' } }
export const Large: Story = { args: { children: '会議室を登録する', variant: 'default', size: 'lg' } }
export const Disabled: Story = { args: { children: '送信中...', variant: 'default', disabled: true } }

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <Button variant="default">デフォルト</Button>
      <Button variant="secondary">セカンダリ</Button>
      <Button variant="outline">アウトライン</Button>
      <Button variant="ghost">ゴースト</Button>
      <Button variant="destructive">削除</Button>
    </div>
  ),
}
