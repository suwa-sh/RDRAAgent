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
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--foreground)' }}>
          渋谷エリア 会議室A
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--foreground-secondary)' }}>
          最大20名収容。プロジェクター・ホワイトボード完備。
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
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--foreground)' }}>
          新宿エリア 会議室B
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--foreground-secondary)' }}>
          ホバーでシャドウが変化します。クリックして詳細へ。
        </p>
      </div>
    ),
  },
}
