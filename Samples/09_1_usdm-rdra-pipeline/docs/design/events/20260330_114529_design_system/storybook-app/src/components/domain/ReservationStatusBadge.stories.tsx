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
export const Confirmed: Story = { args: { status: '予約確定' } }
export const Changing: Story = { args: { status: '変更中' } }
export const Cancelled: Story = { args: { status: '取消済' } }
export const Completed: Story = { args: { status: '完了' } }

export const AllStatuses: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <ReservationStatusBadge status="仮予約" />
      <ReservationStatusBadge status="予約確定" />
      <ReservationStatusBadge status="変更中" />
      <ReservationStatusBadge status="取消済" />
      <ReservationStatusBadge status="完了" />
    </div>
  ),
}
