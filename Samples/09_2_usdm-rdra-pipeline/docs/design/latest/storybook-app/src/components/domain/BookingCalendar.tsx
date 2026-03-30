import React from 'react'
import { Icon } from '../ui/Icon'

export interface BookingCalendarProps {
  selectedDate?: string
  availableSlots?: string[]
  onDateSelect?: (date: string) => void
}

const DAYS = ['日', '月', '火', '水', '木', '金', '土']

export const BookingCalendar: React.FC<BookingCalendarProps> = ({
  selectedDate,
  availableSlots = ['10:00', '11:00', '13:00', '14:00', '15:00', '16:00'],
  onDateSelect,
}) => {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()

  const days: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let i = 1; i <= daysInMonth; i++) days.push(i)

  const selectedDay = selectedDate ? parseInt(selectedDate.split('-')[2]) : null

  return (
    <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--card-radius)', padding: 'var(--spacing-4)' }}>
      {/* Header */}
      <div className="flex items-center justify-between" style={{ marginBottom: 'var(--spacing-3)' }}>
        <span style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--foreground)' }}>
          <Icon name="calendar" size={16} /> {year}年{month + 1}月
        </span>
      </div>
      {/* Day headers */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: 'var(--spacing-2)' }}>
        {DAYS.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--foreground-secondary)', padding: '0.25rem' }}>
            {d}
          </div>
        ))}
      </div>
      {/* Days */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
        {days.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />
          const isSelected = day === selectedDay
          const isPast = day < today.getDate()
          return (
            <button
              key={day}
              onClick={() => !isPast && onDateSelect?.(`${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`)}
              className="rounded-md transition-colors cursor-pointer"
              style={{
                padding: '0.5rem',
                textAlign: 'center',
                fontSize: 'var(--text-sm)',
                backgroundColor: isSelected ? 'var(--primary)' : 'transparent',
                color: isSelected ? 'var(--primary-foreground)' : isPast ? 'var(--foreground-secondary)' : 'var(--foreground)',
                opacity: isPast ? 0.5 : 1,
                cursor: isPast ? 'not-allowed' : 'pointer',
                border: 'none',
              }}
              disabled={isPast}
            >
              {day}
            </button>
          )
        })}
      </div>
      {/* Time slots */}
      <div style={{ marginTop: 'var(--spacing-4)', borderTop: '1px solid var(--border)', paddingTop: 'var(--spacing-3)' }}>
        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--foreground)', marginBottom: 'var(--spacing-2)' }}>
          <Icon name="clock" size={14} /> 利用可能な時間帯
        </div>
        <div className="flex flex-wrap gap-2">
          {availableSlots.map(slot => (
            <button
              key={slot}
              className="rounded-md transition-colors cursor-pointer"
              style={{
                padding: '0.375rem 0.75rem',
                fontSize: 'var(--text-sm)',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--background)',
                color: 'var(--foreground)',
              }}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
