import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React, { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Icon } from '@/components/ui/Icon'
import { BookingCalendar, type CalendarDay } from '@/components/domain/BookingCalendar'
import { PriceDisplay } from '@/components/domain/PriceDisplay'

// ---- モックデータ ----

const mockRoom = {
  id: 'vroom-001',
  name: 'バーチャル会議室 Premium',
  toolType: 'Zoom',
  maxParticipants: 50,
  hasRecording: true,
  pricePerHour: 1500,
}

const mockCalendarDays: CalendarDay[] = [
  { date: 1, status: 'disabled' as const },
  { date: 2, status: 'disabled' as const },
  ...Array.from({ length: 5 }, (_, i) => ({ date: i + 3, status: 'available' as const })),
  { date: 8, status: 'booked' as const },
  { date: 9, status: 'booked' as const },
  ...Array.from({ length: 11 }, (_, i) => ({ date: i + 10, status: 'available' as const })),
  { date: 21, status: 'selected' as const },
  ...Array.from({ length: 9 }, (_, i) => ({ date: i + 22, status: 'available' as const })),
]

// ---- ページコンポーネント ----

interface VirtualRoomBookingPageProps {
  loading?: boolean
  submitted?: boolean
}

const VirtualRoomBookingPage: React.FC<VirtualRoomBookingPageProps> = ({
  loading = false,
  submitted = false,
}) => {
  const [selectedDate, setSelectedDate] = useState<number | null>(21)
  const [startTime, setStartTime] = useState('14:00')
  const [endTime, setEndTime] = useState('16:00')

  const calcHours = () => {
    const [sh, sm] = startTime.split(':').map(Number)
    const [eh, em] = endTime.split(':').map(Number)
    const diff = (eh * 60 + em - (sh * 60 + sm)) / 60
    return Math.max(0, diff)
  }
  const totalPrice = calcHours() * mockRoom.pricePerHour

  if (submitted) {
    return (
      <div style={{ maxWidth: 1280 }} className="mx-auto px-[var(--space-6)] py-[var(--space-8)]">
        <Card className="text-center py-[var(--space-12)]">
          <Icon name="virtual-room" size={48} className="mx-auto mb-[var(--space-4)]" />
          <h2 className="text-[var(--text-xl)] font-[var(--font-semibold)] mb-[var(--space-2)]" style={{ color: 'var(--foreground)' }}>
            予約申請を送信しました
          </h2>
          <p className="text-[var(--text-sm)] mb-[var(--space-6)]" style={{ color: 'var(--foreground-secondary)' }}>
            オーナーの許諾後に会議URLが届きます。
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
            バーチャル会議室を予約する
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--space-6)]">
          {/* 左カラム: 会議室情報 + フォーム */}
          <div className="flex flex-col gap-[var(--space-4)]">
            {/* バーチャル会議室情報 */}
            <Card>
              <div className="flex items-start justify-between mb-[var(--space-4)]">
                <div>
                  <h2 className="text-[var(--text-lg)] font-[var(--font-semibold)]" style={{ color: 'var(--foreground)' }}>
                    {mockRoom.name}
                  </h2>
                </div>
                <Badge variant="virtual">バーチャル</Badge>
              </div>

              <div className="grid grid-cols-3 gap-[var(--space-3)]">
                <div
                  className="flex flex-col items-center gap-[var(--space-1)] p-[var(--space-3)] rounded-[var(--radius-lg)]"
                  style={{ background: 'var(--muted)' }}
                >
                  <Icon name="virtual-room" size={20} />
                  <span className="text-[var(--text-xs)]" style={{ color: 'var(--foreground-secondary)' }}>会議ツール</span>
                  <span className="text-[var(--text-sm)] font-[var(--font-semibold)]" style={{ color: 'var(--foreground)' }}>
                    {mockRoom.toolType}
                  </span>
                </div>
                <div
                  className="flex flex-col items-center gap-[var(--space-1)] p-[var(--space-3)] rounded-[var(--radius-lg)]"
                  style={{ background: 'var(--muted)' }}
                >
                  <Icon name="users" size={20} />
                  <span className="text-[var(--text-xs)]" style={{ color: 'var(--foreground-secondary)' }}>同時接続</span>
                  <span className="text-[var(--text-sm)] font-[var(--font-semibold)]" style={{ color: 'var(--foreground)' }}>
                    {mockRoom.maxParticipants}名
                  </span>
                </div>
                <div
                  className="flex flex-col items-center gap-[var(--space-1)] p-[var(--space-3)] rounded-[var(--radius-lg)]"
                  style={{ background: 'var(--muted)' }}
                >
                  <Icon name="settings" size={20} />
                  <span className="text-[var(--text-xs)]" style={{ color: 'var(--foreground-secondary)' }}>録画</span>
                  <span className="text-[var(--text-sm)] font-[var(--font-semibold)]" style={{ color: 'var(--foreground)' }}>
                    {mockRoom.hasRecording ? '可能' : '不可'}
                  </span>
                </div>
              </div>

              {/* ガイダンス */}
              <div
                className="flex items-start gap-[var(--space-2)] mt-[var(--space-4)] p-[var(--space-3)] rounded-[var(--radius-lg)]"
                style={{ background: 'var(--info-light)' }}
              >
                <Icon name="message" size={16} />
                <p className="text-[var(--text-sm)]" style={{ color: 'var(--color-blue-700)' }}>
                  予約が確定するとオーナーから会議URLが通知されます。
                </p>
              </div>
            </Card>

            {/* 日時選択フォーム */}
            <Card>
              <h2 className="text-[var(--text-base)] font-[var(--font-semibold)] mb-[var(--space-4)]" style={{ color: 'var(--foreground)' }}>
                利用日時を選択
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
                    利用料金
                  </span>
                  <PriceDisplay amount={totalPrice} unit="hour" size="md" />
                </div>

                {selectedDate && (
                  <p className="text-[var(--text-sm)]" style={{ color: 'var(--foreground-secondary)' }}>
                    利用日: 2026年4月{selectedDate}日
                  </p>
                )}
              </div>
            </Card>

            <Button variant="default" size="lg" loading={loading} className="w-full">
              申請する
            </Button>
          </div>

          {/* 右カラム: カレンダー */}
          <div>
            <BookingCalendar
              year={2026}
              month={4}
              days={mockCalendarDays}
              onSelectDay={(date) => setSelectedDate(date)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// ---- Meta ----

const meta: Meta<typeof VirtualRoomBookingPage> = {
  title: 'Pages/利用者/バーチャル会議室予約',
  component: VirtualRoomBookingPage,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof VirtualRoomBookingPage>

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
