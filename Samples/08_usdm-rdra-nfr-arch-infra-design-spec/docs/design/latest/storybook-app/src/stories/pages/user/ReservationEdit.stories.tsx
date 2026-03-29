import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React, { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Icon } from '@/components/ui/Icon'
import { BookingCalendar, type CalendarDay } from '@/components/domain/BookingCalendar'
import { ReservationStatusBadge } from '@/components/domain/ReservationStatusBadge'
import { PriceDisplay } from '@/components/domain/PriceDisplay'

// ---- モックデータ ----

const mockCalendarDays: CalendarDay[] = [
  ...Array.from({ length: 3 }, (_, i) => ({ date: i + 1, status: 'disabled' as const })),
  ...Array.from({ length: 10 }, (_, i) => ({ date: i + 4, status: 'booked' as const })),
  { date: 15, status: 'selected' as const },
  ...Array.from({ length: 5 }, (_, i) => ({ date: i + 16, status: 'available' as const })),
  { date: 21, status: 'booked' as const },
  ...Array.from({ length: 9 }, (_, i) => ({ date: i + 22, status: 'available' as const })),
]

const mockReservation = {
  id: 'rsv-001',
  roomName: '大会議室A（渋谷）',
  currentDate: '2026年4月15日（水）',
  currentTimeStart: '10:00',
  currentTimeEnd: '12:00',
  pricePerHour: 3000,
  status: 'approved' as const,
}

// ---- ページコンポーネント ----

interface ReservationEditPageProps {
  loading?: boolean
  submitted?: boolean
}

const ReservationEditPage: React.FC<ReservationEditPageProps> = ({
  loading = false,
  submitted = false,
}) => {
  const [selectedDate, setSelectedDate] = useState<number | null>(15)
  const [startTime, setStartTime] = useState('10:00')
  const [endTime, setEndTime] = useState('12:00')

  const calcHours = () => {
    const [sh, sm] = startTime.split(':').map(Number)
    const [eh, em] = endTime.split(':').map(Number)
    const diff = (eh * 60 + em - (sh * 60 + sm)) / 60
    return Math.max(0, diff)
  }
  const totalPrice = calcHours() * mockReservation.pricePerHour

  if (submitted) {
    return (
      <div style={{ maxWidth: 1280 }} className="mx-auto px-[var(--space-6)] py-[var(--space-8)]">
        <Card className="text-center py-[var(--space-12)]">
          <Icon name="calendar" size={48} className="mx-auto mb-[var(--space-4)]" />
          <h2 className="text-[var(--text-xl)] font-[var(--font-semibold)] mb-[var(--space-2)]" style={{ color: 'var(--foreground)' }}>
            予約変更を申請しました
          </h2>
          <p className="text-[var(--text-sm)] mb-[var(--space-6)]" style={{ color: 'var(--foreground-secondary)' }}>
            再度オーナーの許諾をお待ちください。
          </p>
          <Button variant="outline">予約一覧に戻る</Button>
        </Card>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1280 }} className="mx-auto px-[var(--space-6)] py-[var(--space-8)]">
      <div className="flex flex-col gap-[var(--space-6)]">
        {/* ページタイトル */}
        <div className="flex items-center gap-[var(--space-3)]">
          <Button variant="ghost" size="sm">
            <Icon name="map-pin" size={14} />
            戻る
          </Button>
          <h1 className="text-[var(--text-2xl)] font-[var(--font-bold)]" style={{ color: 'var(--foreground)' }}>
            予約を変更する
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--space-6)]">
          {/* 現在の予約情報 */}
          <div className="flex flex-col gap-[var(--space-4)]">
            <Card>
              <div className="flex items-center justify-between mb-[var(--space-4)]">
                <h2 className="text-[var(--text-base)] font-[var(--font-semibold)]" style={{ color: 'var(--foreground)' }}>
                  現在の予約
                </h2>
                <ReservationStatusBadge status={mockReservation.status} />
              </div>
              <div className="flex flex-col gap-[var(--space-2)] text-[var(--text-sm)]" style={{ color: 'var(--foreground-secondary)' }}>
                <div className="flex items-center gap-[var(--space-2)]">
                  <Icon name="room" size={16} />
                  <span style={{ color: 'var(--foreground)' }}>{mockReservation.roomName}</span>
                </div>
                <div className="flex items-center gap-[var(--space-2)]">
                  <Icon name="calendar" size={16} />
                  <span>{mockReservation.currentDate}</span>
                </div>
                <div className="flex items-center gap-[var(--space-2)]">
                  <Icon name="clock" size={16} />
                  <span>{mockReservation.currentTimeStart} 〜 {mockReservation.currentTimeEnd}</span>
                </div>
              </div>
            </Card>

            {/* 変更後の日時入力 */}
            <Card>
              <h2 className="text-[var(--text-base)] font-[var(--font-semibold)] mb-[var(--space-4)]" style={{ color: 'var(--foreground)' }}>
                変更後の日時
              </h2>
              <div className="flex flex-col gap-[var(--space-3)]">
                <div className="grid grid-cols-2 gap-[var(--space-3)]">
                  <Input
                    label="開始時間"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                  <Input
                    label="終了時間"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>

                <div
                  className="flex items-center justify-between p-[var(--space-4)] rounded-[var(--radius-lg)] border"
                  style={{ borderColor: 'var(--border)', background: 'var(--muted)' }}
                >
                  <span className="text-[var(--text-sm)]" style={{ color: 'var(--foreground-secondary)' }}>
                    変更後の利用料金
                  </span>
                  <PriceDisplay amount={totalPrice} unit="hour" size="md" />
                </div>
              </div>
            </Card>

            {/* 操作ボタン */}
            <div className="flex gap-[var(--space-3)]">
              <Button
                variant="default"
                size="lg"
                loading={loading}
                className="flex-1"
              >
                変更する
              </Button>
              <Button variant="ghost" size="lg">
                キャンセル
              </Button>
            </div>
          </div>

          {/* カレンダー */}
          <div>
            <BookingCalendar
              year={2026}
              month={4}
              days={mockCalendarDays}
              onSelectDay={(date) => setSelectedDate(date)}
            />
            {selectedDate && (
              <p className="text-[var(--text-sm)] mt-[var(--space-2)] text-center" style={{ color: 'var(--foreground-secondary)' }}>
                選択中: 2026年4月{selectedDate}日
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ---- Meta ----

const meta: Meta<typeof ReservationEditPage> = {
  title: 'Pages/利用者/予約変更',
  component: ReservationEditPage,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof ReservationEditPage>

// ---- Stories ----

export const Default: Story = {
  args: {
    loading: false,
    submitted: false,
  },
}

export const Loading: Story = {
  args: {
    loading: true,
    submitted: false,
  },
}

export const Submitted: Story = {
  args: {
    loading: false,
    submitted: true,
  },
}
