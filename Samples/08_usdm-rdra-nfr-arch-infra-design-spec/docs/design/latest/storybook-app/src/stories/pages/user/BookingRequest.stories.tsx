import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React from 'react'
import { UserLayout } from '@/components/layout/UserLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Icon } from '@/components/ui/Icon'
import { BookingCalendar, type CalendarDay } from '@/components/domain/BookingCalendar'
import { PriceDisplay } from '@/components/domain/PriceDisplay'

// ---- モックデータ ----

type BookingStep = 'select' | 'confirm' | 'complete'

interface BookingRequestPageProps {
  step?: BookingStep
  paymentConfigured?: boolean
  isSubmitting?: boolean
}

// 2026年4月のカレンダーデータ
const mockDays: CalendarDay[] = Array.from({ length: 30 }, (_, i) => {
  const date = i + 1
  if ([3, 4, 10, 11, 17, 18, 24, 25].includes(date)) return { date, status: 'disabled' }
  if ([5, 6, 7, 12, 15, 20, 22, 28].includes(date)) return { date, status: 'booked' }
  if (date === 15) return { date, status: 'selected' }
  return { date, status: 'available' }
})

const pricePerHour = 5000

// ---- ページコンポーネント ----

const BookingRequestPage: React.FC<BookingRequestPageProps> = ({
  step = 'select',
  paymentConfigured = true,
  isSubmitting = false,
}) => {
  const [selectedDate, setSelectedDate] = React.useState<number | null>(step === 'confirm' || step === 'complete' ? 15 : null)
  const [startTime, setStartTime] = React.useState(step === 'confirm' || step === 'complete' ? '10:00' : '')
  const [endTime, setEndTime] = React.useState(step === 'confirm' || step === 'complete' ? '12:00' : '')

  const calcHours = () => {
    if (!startTime || !endTime) return 0
    const [sh, sm] = startTime.split(':').map(Number)
    const [eh, em] = endTime.split(':').map(Number)
    const diff = (eh * 60 + em) - (sh * 60 + sm)
    return diff > 0 ? diff / 60 : 0
  }

  const hours = calcHours()
  const totalPrice = Math.round(pricePerHour * hours)

  if (step === 'complete') {
    return (
      <UserLayout currentPage="reservations">
        <div className="flex flex-col items-center justify-center gap-[var(--space-6)] py-[var(--space-16)]">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: 'var(--success-light)' }}
          >
            <Icon name="shield-check" size={40} />
          </div>
          <div className="text-center">
            <h1
              className="text-[var(--text-2xl)] font-[var(--font-bold)]"
              style={{ color: 'var(--foreground)' }}
            >
              予約申請が完了しました
            </h1>
            <p className="text-[var(--text-base)] mt-[var(--space-2)]" style={{ color: 'var(--foreground-secondary)' }}>
              オーナーの承認をお待ちください
            </p>
          </div>
          <Card className="w-full max-w-md">
            <dl className="flex flex-col gap-[var(--space-3)]">
              {[
                { label: '会議室',     value: '大会議室A（渋谷）' },
                { label: '利用日',     value: '2026年4月15日（水）' },
                { label: '利用時間',   value: `${startTime} 〜 ${endTime}（2時間）` },
                { label: '利用料金',   value: `¥${totalPrice.toLocaleString()}` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center">
                  <dt className="text-[var(--text-sm)]" style={{ color: 'var(--foreground-muted)' }}>{label}</dt>
                  <dd className="text-[var(--text-sm)] font-[var(--font-semibold)]" style={{ color: 'var(--foreground)' }}>{value}</dd>
                </div>
              ))}
            </dl>
          </Card>
          <div className="flex gap-[var(--space-3)]">
            <Button variant="outline" size="md">
              会議室検索に戻る
            </Button>
            <Button size="md">
              <Icon name="calendar" size={16} />
              予約一覧を確認する
            </Button>
          </div>
        </div>
      </UserLayout>
    )
  }

  return (
    <UserLayout currentPage="reservations">
      <div className="flex flex-col gap-[var(--space-6)]">
        {/* パンくずリスト */}
        <nav className="flex items-center gap-[var(--space-2)] text-[var(--text-sm)]" aria-label="パンくずリスト">
          <a href="#" style={{ color: 'var(--primary)' }}>会議室検索</a>
          <span style={{ color: 'var(--foreground-muted)' }}>/</span>
          <a href="#" style={{ color: 'var(--primary)' }}>大会議室A（渋谷）</a>
          <span style={{ color: 'var(--foreground-muted)' }}>/</span>
          <span style={{ color: 'var(--foreground-secondary)' }}>予約申請</span>
        </nav>

        {/* ステップインジケーター */}
        <div className="flex items-center gap-[var(--space-3)]">
          {(['select', 'confirm', 'complete'] as const).map((s, i) => {
            const labels = { select: '日時選択', confirm: '内容確認', complete: '申請完了' }
            const isActive = s === step
            const isDone = ['select', 'confirm', 'complete'].indexOf(step) > i
            return (
              <React.Fragment key={s}>
                {i > 0 && (
                  <div
                    className="flex-1 h-px"
                    style={{ background: isDone ? 'var(--primary)' : 'var(--border)' }}
                  />
                )}
                <div className="flex items-center gap-[var(--space-2)]">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[var(--text-xs)] font-[var(--font-bold)]"
                    style={{
                      background: isActive || isDone ? 'var(--primary)' : 'var(--muted)',
                      color: isActive || isDone ? '#FFFFFF' : 'var(--foreground-muted)',
                    }}
                  >
                    {i + 1}
                  </div>
                  <span
                    className="text-[var(--text-sm)] font-[var(--font-medium)] hidden sm:block"
                    style={{ color: isActive ? 'var(--primary)' : isDone ? 'var(--foreground-secondary)' : 'var(--foreground-muted)' }}
                  >
                    {labels[s]}
                  </span>
                </div>
              </React.Fragment>
            )
          })}
        </div>

        <div className="flex flex-col lg:flex-row gap-[var(--space-6)] items-start">
          {/* Main Form */}
          <div className="flex-1 min-w-0 flex flex-col gap-[var(--space-6)]">
            {/* カレンダー */}
            <BookingCalendar
              year={2026}
              month={4}
              days={mockDays}
              onSelectDay={setSelectedDate}
            />

            {/* 時間選択 */}
            <Card>
              <h2 className="text-[var(--text-lg)] font-[var(--font-semibold)] mb-[var(--space-4)]" style={{ color: 'var(--foreground)' }}>
                利用時間を選択
              </h2>
              {selectedDate ? (
                <div className="flex flex-col gap-[var(--space-4)]">
                  <p className="text-[var(--text-sm)]" style={{ color: 'var(--foreground-secondary)' }}>
                    選択日: 2026年4月{selectedDate}日
                  </p>
                  <div className="flex items-end gap-[var(--space-3)]">
                    <div className="flex-1">
                      <Input
                        label="開始時間"
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        min="08:00"
                        max="22:00"
                      />
                    </div>
                    <span className="pb-2 text-[var(--text-sm)]" style={{ color: 'var(--foreground-muted)' }}>〜</span>
                    <div className="flex-1">
                      <Input
                        label="終了時間"
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        min="08:00"
                        max="22:00"
                      />
                    </div>
                  </div>
                  {hours > 0 && (
                    <p className="text-[var(--text-sm)]" style={{ color: 'var(--foreground-secondary)' }}>
                      利用時間: {hours}時間
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-[var(--text-sm)]" style={{ color: 'var(--foreground-muted)' }}>
                  カレンダーから利用日を選択してください
                </p>
              )}
            </Card>

            {/* 運用ルール概要 */}
            <Card>
              <h2 className="text-[var(--text-lg)] font-[var(--font-semibold)] mb-[var(--space-3)]" style={{ color: 'var(--foreground)' }}>
                運用ルール
              </h2>
              <dl className="flex flex-col gap-[var(--space-2)] text-[var(--text-sm)]">
                {[
                  { label: '利用可能時間', value: '08:00 〜 22:00' },
                  { label: '最低利用時間', value: '1時間〜' },
                  { label: '最大利用時間', value: '〜8時間' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between">
                    <dt style={{ color: 'var(--foreground-muted)' }}>{label}</dt>
                    <dd style={{ color: 'var(--foreground)' }} className="font-[var(--font-medium)]">{value}</dd>
                  </div>
                ))}
              </dl>
            </Card>
          </div>

          {/* Summary Panel */}
          <aside className="w-full lg:w-80 shrink-0">
            <div className="sticky top-20">
              <Card>
                <h2 className="text-[var(--text-base)] font-[var(--font-semibold)] mb-[var(--space-4)]" style={{ color: 'var(--foreground)' }}>
                  予約内容
                </h2>
                <dl className="flex flex-col gap-[var(--space-3)] text-[var(--text-sm)] mb-[var(--space-4)]">
                  <div className="flex justify-between">
                    <dt style={{ color: 'var(--foreground-muted)' }}>会議室</dt>
                    <dd style={{ color: 'var(--foreground)' }} className="font-[var(--font-medium)] text-right">大会議室A（渋谷）</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt style={{ color: 'var(--foreground-muted)' }}>利用日</dt>
                    <dd style={{ color: 'var(--foreground)' }} className="font-[var(--font-medium)]">
                      {selectedDate ? `2026年4月${selectedDate}日` : '未選択'}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt style={{ color: 'var(--foreground-muted)' }}>利用時間</dt>
                    <dd style={{ color: 'var(--foreground)' }} className="font-[var(--font-medium)]">
                      {startTime && endTime ? `${startTime} 〜 ${endTime}` : '未選択'}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt style={{ color: 'var(--foreground-muted)' }}>時間単価</dt>
                    <dd style={{ color: 'var(--foreground)' }} className="font-[var(--font-medium)]">¥{pricePerHour.toLocaleString()}/時間</dd>
                  </div>
                </dl>

                {/* 料金表示 */}
                <div
                  className="py-[var(--space-3)] border-t border-b flex justify-between items-center mb-[var(--space-4)]"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <span className="text-[var(--text-sm)] font-[var(--font-semibold)]" style={{ color: 'var(--foreground)' }}>
                    利用料金
                  </span>
                  <PriceDisplay amount={totalPrice} unit="day" size="lg" />
                </div>

                {/* 決済方法 */}
                <div className="flex items-center justify-between mb-[var(--space-4)]">
                  <div className="flex items-center gap-[var(--space-2)]">
                    <Icon name="credit-card" size={16} />
                    <span className="text-[var(--text-sm)]" style={{ color: 'var(--foreground)' }}>決済方法</span>
                  </div>
                  {paymentConfigured ? (
                    <Badge variant="success">設定済み</Badge>
                  ) : (
                    <Badge variant="warning">未設定</Badge>
                  )}
                </div>
                {!paymentConfigured && (
                  <p className="text-[var(--text-xs)] mb-[var(--space-3)]" style={{ color: 'var(--foreground-muted)' }}>
                    予約申請には決済方法の設定が必要です。
                    <a href="#" style={{ color: 'var(--primary)' }}>決済方法を設定する</a>
                  </p>
                )}

                {/* アクションボタン */}
                <div className="flex flex-col gap-[var(--space-2)]">
                  <Button
                    size="lg"
                    className="w-full"
                    disabled={!selectedDate || !startTime || !endTime || !paymentConfigured || isSubmitting}
                    loading={isSubmitting}
                  >
                    申請する
                  </Button>
                  <Button variant="ghost" size="md" className="w-full">
                    会議室詳細に戻る
                  </Button>
                </div>
              </Card>
            </div>
          </aside>
        </div>
      </div>
    </UserLayout>
  )
}

// ---- Meta ----

const meta: Meta<typeof BookingRequestPage> = {
  title: 'Pages/利用者/予約申請',
  component: BookingRequestPage,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof BookingRequestPage>

// ---- Stories ----

export const Default: Story = {
  args: {
    step: 'select',
    paymentConfigured: true,
    isSubmitting: false,
  },
}

export const WithDateSelected: Story = {
  args: {
    step: 'confirm',
    paymentConfigured: true,
    isSubmitting: false,
  },
}

export const PaymentNotConfigured: Story = {
  args: {
    step: 'select',
    paymentConfigured: false,
    isSubmitting: false,
  },
}

export const Submitting: Story = {
  args: {
    step: 'confirm',
    paymentConfigured: true,
    isSubmitting: true,
  },
}

export const Complete: Story = {
  args: {
    step: 'complete',
    paymentConfigured: true,
    isSubmitting: false,
  },
}
