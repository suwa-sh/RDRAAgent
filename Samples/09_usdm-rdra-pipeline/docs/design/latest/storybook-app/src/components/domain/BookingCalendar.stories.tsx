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
    selectedDate: '2026-03-30',
    startTime: '10:00',
    endTime: '12:00',
  },
}

export const NoSelection: Story = { args: {} }
