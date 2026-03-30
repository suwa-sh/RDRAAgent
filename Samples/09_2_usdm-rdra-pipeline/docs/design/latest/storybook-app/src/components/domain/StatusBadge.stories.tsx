import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { StatusBadge } from './StatusBadge'

const meta: Meta<typeof StatusBadge> = {
  title: 'Domain/StatusBadge',
  component: StatusBadge,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof StatusBadge>

export const OwnerStates: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <StatusBadge status="未登録" model="owner" />
      <StatusBadge status="申請中" model="owner" />
      <StatusBadge status="審査中" model="owner" />
      <StatusBadge status="承認済" model="owner" />
      <StatusBadge status="却下" model="owner" />
      <StatusBadge status="退会" model="owner" />
    </div>
  ),
}

export const ReservationStates: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <StatusBadge status="予約申請中" model="reservation" />
      <StatusBadge status="予約確定" model="reservation" />
      <StatusBadge status="変更中" model="reservation" />
      <StatusBadge status="取消済" model="reservation" />
      <StatusBadge status="利用済" model="reservation" />
    </div>
  ),
}

export const KeyStates: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <StatusBadge status="保管中" model="key" />
      <StatusBadge status="貸出中" model="key" />
      <StatusBadge status="返却済" model="key" />
    </div>
  ),
}

export const RoomStates: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <StatusBadge status="未公開" model="room" />
      <StatusBadge status="公開中" model="room" />
      <StatusBadge status="貸出停止" model="room" />
    </div>
  ),
}
