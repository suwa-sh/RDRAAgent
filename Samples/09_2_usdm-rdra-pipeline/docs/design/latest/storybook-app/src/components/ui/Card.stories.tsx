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
        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', marginBottom: '0.5rem' }}>
          渋谷コワーキングスペース A
        </h3>
        <p style={{ color: 'var(--foreground-secondary)', fontSize: 'var(--text-sm)' }}>
          渋谷区渋谷1-1-1 / 収容人数: 20名
        </p>
      </div>
    ),
  },
}

export const Hoverable: Story = {
  args: {
    hoverable: true,
    children: (
      <div>
        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', marginBottom: '0.5rem' }}>
          新宿会議室 B
        </h3>
        <p style={{ color: 'var(--foreground-secondary)', fontSize: 'var(--text-sm)' }}>
          新宿区西新宿2-2-2 / 収容人数: 10名
        </p>
        <p style={{ color: 'var(--foreground-secondary)', fontSize: 'var(--text-xs)', marginTop: '0.25rem' }}>
          ホバーすると影が変わります
        </p>
      </div>
    ),
  },
}
