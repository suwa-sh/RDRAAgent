import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { BookingCalendar } from './BookingCalendar'

const meta: Meta<typeof BookingCalendar> = {
  title: 'Domain/BookingCalendar',
  component: BookingCalendar,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof BookingCalendar>

export const Default: Story = {
  args: {
    availableSlots: ['10:00', '11:00', '13:00', '14:00', '15:00', '16:00'],
  },
}

export const WithSelection: Story = {
  args: {
    selectedDate: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-15`,
    availableSlots: ['09:00', '10:00', '14:00', '15:00'],
  },
}
