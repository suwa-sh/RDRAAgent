import React from 'react'
import { Card } from '../ui/Card'
import { Icon } from '../ui/Icon'
import { Button } from '../ui/Button'

export interface BookingCalendarProps {
  selectedDate?: string
  startTime?: string
  endTime?: string
  onSelect?: (date: string, start: string, end: string) => void
}

const DAYS = ['日', '月', '火', '水', '木', '金', '土']
const TIMES = Array.from({ length: 13 }, (_, i) => `${(i + 8).toString().padStart(2, '0')}:00`)

export const BookingCalendar: React.FC<BookingCalendarProps> = ({
  selectedDate = '',
  startTime = '09:00',
  endTime = '10:00',
  onSelect,
}) => {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Icon name="calendar" size={20} />
        <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>
          {year}年{month + 1}月
        </h3>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-4">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-xs font-medium py-1" style={{ color: 'var(--muted-foreground)' }}>
            {d}
          </div>
        ))}
        {Array.from({ length: firstDay }, (_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const isSelected = dateStr === selectedDate
          const isToday = day === today.getDate()
          return (
            <button
              key={day}
              className="py-1 text-sm rounded cursor-pointer transition-colors"
              style={{
                backgroundColor: isSelected ? 'var(--primary)' : 'transparent',
                color: isSelected ? 'var(--primary-foreground)' : 'var(--foreground)',
                fontWeight: isToday ? 700 : 400,
              }}
              onClick={() => onSelect?.(dateStr, startTime, endTime)}
            >
              {day}
            </button>
          )
        })}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <Icon name="clock" size={16} />
          <select
            className="rounded px-2 py-1 text-sm"
            style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}
            defaultValue={startTime}
          >
            {TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <span style={{ color: 'var(--muted-foreground)' }}>~</span>
        <select
          className="rounded px-2 py-1 text-sm"
          style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}
          defaultValue={endTime}
        >
          {TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <Button variant="default" size="sm">予約確認</Button>
      </div>
    </Card>
  )
}
