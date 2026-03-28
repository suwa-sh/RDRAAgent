import React from 'react'
import { Card } from '../ui/Card'

export type DayStatus = 'available' | 'booked' | 'selected' | 'disabled'

export interface CalendarDay {
  date: number
  status: DayStatus
}

export interface BookingCalendarProps {
  year: number
  month: number
  days: CalendarDay[]
  onSelectDay?: (date: number) => void
}

const dayLabels = ['月', '火', '水', '木', '金', '土', '日']

const statusStyles: Record<DayStatus, string> = {
  available: 'bg-[var(--calendar-available-bg)] text-[color:var(--foreground)] cursor-pointer hover:opacity-80',
  booked: 'bg-[var(--calendar-booked-bg)] text-[color:var(--foreground-muted)] cursor-not-allowed',
  selected: 'bg-[var(--calendar-selected-bg)] text-[color:var(--foreground)] ring-2 ring-[var(--primary)] cursor-pointer',
  disabled: 'bg-[var(--muted)] text-[color:var(--foreground-muted)] cursor-not-allowed',
}

export const BookingCalendar: React.FC<BookingCalendarProps> = ({
  year,
  month,
  days,
  onSelectDay,
}) => {
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay()
  const offset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1

  return (
    <Card>
      <div className="flex items-center justify-between mb-[var(--space-4)]">
        <button className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-md)] hover:bg-[var(--muted)]" style={{ color: 'var(--foreground)' }} aria-label="前月">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h3 className="text-[var(--text-base)] font-[var(--font-semibold)]" style={{ color: 'var(--foreground)' }}>
          {year}年{month}月
        </h3>
        <button className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-md)] hover:bg-[var(--muted)]" style={{ color: 'var(--foreground)' }} aria-label="翌月">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-[var(--space-1)]">
        {dayLabels.map((label) => (
          <div
            key={label}
            className="flex items-center justify-center text-[var(--text-xs)] font-[var(--font-medium)] text-[color:var(--foreground-muted)] h-8"
          >
            {label}
          </div>
        ))}

        {Array.from({ length: offset }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {days.map((day) => (
          <button
            key={day.date}
            className={[
              'flex items-center justify-center rounded-[var(--radius-md)] text-[var(--text-sm)] transition-colors',
              statusStyles[day.status],
            ].join(' ')}
            style={{ width: 'var(--calendar-cell-size)', height: 'var(--calendar-cell-size)' }}
            disabled={day.status === 'booked' || day.status === 'disabled'}
            onClick={() => day.status !== 'booked' && day.status !== 'disabled' && onSelectDay?.(day.date)}
          >
            {day.date}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-[var(--space-4)] mt-[var(--space-4)] text-[var(--text-xs)] text-[color:var(--foreground-secondary)]">
        <span className="flex items-center gap-[var(--space-1)]">
          <span className="w-3 h-3 rounded-sm bg-[var(--calendar-available-bg)] border border-[var(--border-strong)]" /> 空きあり
        </span>
        <span className="flex items-center gap-[var(--space-1)]">
          <span className="w-3 h-3 rounded-sm bg-[var(--calendar-booked-bg)] border border-[var(--border-strong)]" /> 予約済み
        </span>
        <span className="flex items-center gap-[var(--space-1)]">
          <span className="w-3 h-3 rounded-sm bg-[var(--calendar-selected-bg)] ring-2 ring-[var(--primary)]" /> 選択中
        </span>
      </div>
    </Card>
  )
}
