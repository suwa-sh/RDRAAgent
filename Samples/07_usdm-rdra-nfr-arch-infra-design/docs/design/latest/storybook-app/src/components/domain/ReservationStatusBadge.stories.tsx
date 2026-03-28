import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ReservationStatusBadge } from './ReservationStatusBadge'

const meta: Meta<typeof ReservationStatusBadge> = {
  title: 'Domain/ReservationStatusBadge',
  component: ReservationStatusBadge,
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['pending', 'approved', 'in-use', 'completed', 'cancelled', 'rejected'],
    },
  },
}

export default meta
type Story = StoryObj<typeof ReservationStatusBadge>

export const Pending: Story = {
  args: { status: 'pending' },
}

export const Approved: Story = {
  args: { status: 'approved' },
}

export const InUse: Story = {
  args: { status: 'in-use' },
}

export const Completed: Story = {
  args: { status: 'completed' },
}

export const Cancelled: Story = {
  args: { status: 'cancelled' },
}

export const Rejected: Story = {
  args: { status: 'rejected' },
}
