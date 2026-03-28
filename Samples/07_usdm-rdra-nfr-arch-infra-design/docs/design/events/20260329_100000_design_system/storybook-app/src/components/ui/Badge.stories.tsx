import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Badge } from './Badge'

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'destructive', 'info', 'virtual', 'outline'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = {
  args: {
    children: '完了',
    variant: 'default',
  },
}

export const Success: Story = {
  args: {
    children: '確定',
    variant: 'success',
  },
}

export const Warning: Story = {
  args: {
    children: '申請中',
    variant: 'warning',
  },
}

export const Destructive: Story = {
  args: {
    children: '拒否',
    variant: 'destructive',
  },
}

export const Info: Story = {
  args: {
    children: '利用中',
    variant: 'info',
  },
}

export const Virtual: Story = {
  args: {
    children: 'バーチャル',
    variant: 'virtual',
  },
}

export const Outline: Story = {
  args: {
    children: '未審査',
    variant: 'outline',
  },
}
