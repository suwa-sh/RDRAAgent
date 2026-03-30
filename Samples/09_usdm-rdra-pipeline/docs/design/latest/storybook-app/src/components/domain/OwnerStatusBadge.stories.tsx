import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { OwnerStatusBadge } from './OwnerStatusBadge'

const meta: Meta<typeof OwnerStatusBadge> = {
  title: 'Domain/OwnerStatusBadge',
  component: OwnerStatusBadge,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof OwnerStatusBadge>

export const AllStatuses: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {(['未申請', '申請中', '審査中', '承認', '却下', '退会'] as const).map((s) => (
        <OwnerStatusBadge key={s} status={s} />
      ))}
    </div>
  ),
}
