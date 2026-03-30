import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Badge } from './Badge'

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'destructive', 'info', 'outline'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = { args: { children: '新着', variant: 'default' } }
export const Success: Story = { args: { children: '承認', variant: 'success' } }
export const Warning: Story = { args: { children: '審査中', variant: 'warning' } }
export const Destructive: Story = { args: { children: '却下', variant: 'destructive' } }
export const Info: Story = { args: { children: '申請中', variant: 'info' } }
export const Outline: Story = { args: { children: 'Wi-Fi', variant: 'outline' } }

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <Badge variant="default">デフォルト</Badge>
      <Badge variant="success">承認</Badge>
      <Badge variant="warning">審査中</Badge>
      <Badge variant="destructive">却下</Badge>
      <Badge variant="info">申請中</Badge>
      <Badge variant="outline">タグ</Badge>
    </div>
  ),
}
