import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'secondary', 'outline', 'ghost', 'destructive'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
}
export default meta

type Story = StoryObj<typeof Button>

export const Default: Story = { args: { children: '予約する', variant: 'default' } }
export const Secondary: Story = { args: { children: 'キャンセル', variant: 'secondary' } }
export const Outline: Story = { args: { children: '詳細を見る', variant: 'outline' } }
export const Ghost: Story = { args: { children: 'もっと見る', variant: 'ghost' } }
export const Destructive: Story = { args: { children: '削除', variant: 'destructive' } }
export const Small: Story = { args: { children: 'Small', size: 'sm' } }
export const Large: Story = { args: { children: 'Large', size: 'lg' } }
export const Disabled: Story = { args: { children: '無効', disabled: true } }
