import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { BookingCalendar, type CalendarDay } from './BookingCalendar'

const april2026Days: CalendarDay[] = Array.from({ length: 30 }, (_, i) => {
  const date = i + 1
  const dayOfWeek = new Date(2026, 3, date).getDay()
  const isSunday = dayOfWeek === 0
  const isSaturday = dayOfWeek === 6

  let status: CalendarDay['status']
  if (isSunday) {
    status = 'disabled'
  } else if ([3, 7, 10, 14, 17, 21, 24, 28].includes(date)) {
    status = 'booked'
  } else if (date === 15) {
    status = 'selected'
  } else {
    status = 'available'
  }

  return { date, status }
})

const meta: Meta<typeof BookingCalendar> = {
  title: 'Domain/BookingCalendar',
  component: BookingCalendar,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 400 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof BookingCalendar>

export const April2026: Story = {
  args: {
    year: 2026,
    month: 4,
    days: april2026Days,
    onSelectDay: (date: number) => {
      console.log('選択された日付:', date)
    },
  },
}
