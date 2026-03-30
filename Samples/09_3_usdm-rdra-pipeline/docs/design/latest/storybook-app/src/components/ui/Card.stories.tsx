import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Card } from './Card'

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof Card>

export const Default: Story = {
  args: {
    children: (
      <div>
        <h3 style={{ fontWeight: 600, marginBottom: 8 }}>カードタイトル</h3>
        <p style={{ color: 'var(--muted-foreground)', fontSize: 14 }}>カードの本文テキストが入ります。</p>
      </div>
    ),
  },
}

export const Hoverable: Story = {
  args: {
    hoverable: true,
    children: (
      <div>
        <h3 style={{ fontWeight: 600, marginBottom: 8 }}>ホバー可能カード</h3>
        <p style={{ color: 'var(--muted-foreground)', fontSize: 14 }}>マウスオーバーで影が強調されます。</p>
      </div>
    ),
  },
}
