import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ReservationStatusBadge } from './ReservationStatusBadge'

const meta: Meta<typeof ReservationStatusBadge> = {
  title: 'Domain/ReservationStatusBadge',
  component: ReservationStatusBadge,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof ReservationStatusBadge>

export const Tentative: Story = { args: { status: '仮予約' } }
export const Confirmed: Story = { args: { status: '確定' } }
export const InUse: Story = { args: { status: '利用中' } }
export const Completed: Story = { args: { status: '利用完了' } }
export const Cancelled: Story = { args: { status: '取消' } }

export const AllStatuses: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {(['仮予約', '確定', '変更中', '利用中', '利用完了', '取消'] as const).map((s) => (
        <ReservationStatusBadge key={s} status={s} />
      ))}
    </div>
  ),
}
