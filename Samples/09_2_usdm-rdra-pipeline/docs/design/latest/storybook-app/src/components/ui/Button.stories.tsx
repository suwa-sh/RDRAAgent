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
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {
  args: {
    children: '予約する',
    variant: 'default',
    size: 'md',
  },
}

export const Secondary: Story = {
  args: {
    children: 'キャンセル',
    variant: 'secondary',
  },
}

export const Outline: Story = {
  args: {
    children: '詳細を見る',
    variant: 'outline',
  },
}

export const Ghost: Story = {
  args: {
    children: '戻る',
    variant: 'ghost',
  },
}

export const Destructive: Story = {
  args: {
    children: '削除する',
    variant: 'destructive',
  },
}

export const Small: Story = {
  args: {
    children: '検索',
    variant: 'default',
    size: 'sm',
  },
}

export const Large: Story = {
  args: {
    children: '会議室を予約する',
    variant: 'default',
    size: 'lg',
  },
}

export const Disabled: Story = {
  args: {
    children: '送信中...',
    variant: 'default',
    disabled: true,
  },
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <Button variant="default">予約する</Button>
      <Button variant="secondary">キャンセル</Button>
      <Button variant="outline">詳細を見る</Button>
      <Button variant="ghost">戻る</Button>
      <Button variant="destructive">削除する</Button>
    </div>
  ),
}
