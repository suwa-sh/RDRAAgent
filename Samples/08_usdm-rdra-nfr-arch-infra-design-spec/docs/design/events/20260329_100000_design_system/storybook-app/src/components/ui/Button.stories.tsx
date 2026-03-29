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
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
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
    size: 'md',
  },
}

export const Outline: Story = {
  args: {
    children: '詳細を見る',
    variant: 'outline',
    size: 'md',
  },
}

export const Ghost: Story = {
  args: {
    children: '戻る',
    variant: 'ghost',
    size: 'md',
  },
}

export const Destructive: Story = {
  args: {
    children: '削除する',
    variant: 'destructive',
    size: 'md',
  },
}

export const Small: Story = {
  args: {
    children: '小さいボタン',
    variant: 'default',
    size: 'sm',
  },
}

export const Medium: Story = {
  args: {
    children: '中サイズボタン',
    variant: 'default',
    size: 'md',
  },
}

export const Large: Story = {
  args: {
    children: '大きいボタン',
    variant: 'default',
    size: 'lg',
  },
}

export const Loading: Story = {
  args: {
    children: '送信中...',
    variant: 'default',
    size: 'md',
    loading: true,
  },
}
