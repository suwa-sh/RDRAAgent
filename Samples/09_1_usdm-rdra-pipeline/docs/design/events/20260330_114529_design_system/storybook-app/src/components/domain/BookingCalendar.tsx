import React, { useState } from 'react'
import { Button } from '../ui/Button'
import { Icon } from '../ui/Icon'

export interface BookingCalendarProps {
  selectedDate?: string
  availableDates?: string[]
  onSelect?: (date: string) => void
}

const DAYS = ['日', '月', '火', '水', '木', '金', '土']

export const BookingCalendar: React.FC<BookingCalendarProps> = ({
  selectedDate,
  availableDates = [],
  onSelect,
}) => {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())

  const firstDay = new Date(currentYear, currentMonth, 1).getDay()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const formatDate = (day: number) =>
    `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  return (
    <div
      style={{
        padding: '1.5rem',
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: 'var(--radius-lg)',
        width: '320px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <Button variant="ghost" size="sm" onClick={prevMonth}>
          <Icon name="chevron-right" size={16} className="rotate-180" />
        </Button>
        <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--foreground)' }}>
          {currentYear}年{currentMonth + 1}月
        </span>
        <Button variant="ghost" size="sm" onClick={nextMonth}>
          <Icon name="chevron-right" size={16} />
        </Button>
      </div>

      {/* Day headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '4px' }}>
        {DAYS.map((d) => (
          <div
            key={d}
            style={{
              textAlign: 'center',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--foreground-secondary)',
              padding: '0.25rem',
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Days */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
        {Array.from({ length: firstDay }, (_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1
          const dateStr = formatDate(day)
          const isSelected = dateStr === selectedDate
          const isAvailable = availableDates.length === 0 || availableDates.includes(dateStr)
          const isToday =
            day === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear()

          return (
            <button
              key={day}
              onClick={() => isAvailable && onSelect?.(dateStr)}
              disabled={!isAvailable}
              style={{
                width: '100%',
                aspectRatio: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontWeight: isToday ? 700 : 400,
                border: isToday ? '2px solid var(--primary)' : 'none',
                backgroundColor: isSelected ? 'var(--primary)' : 'transparent',
                color: isSelected
                  ? 'var(--primary-foreground)'
                  : isAvailable
                  ? 'var(--foreground)'
                  : 'var(--muted-foreground)',
                cursor: isAvailable ? 'pointer' : 'default',
                opacity: isAvailable ? 1 : 0.4,
              }}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}
