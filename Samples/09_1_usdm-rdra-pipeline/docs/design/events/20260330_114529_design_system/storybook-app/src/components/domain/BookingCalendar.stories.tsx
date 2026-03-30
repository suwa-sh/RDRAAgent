import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { BookingCalendar } from './BookingCalendar'

const meta: Meta<typeof BookingCalendar> = {
  title: 'Domain/BookingCalendar',
  component: BookingCalendar,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof BookingCalendar>

export const Default: Story = { args: {} }

export const WithSelection: Story = {
  args: { selectedDate: '2026-03-30' },
}
