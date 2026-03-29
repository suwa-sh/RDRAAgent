import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React, { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { ReservationStatusBadge } from '@/components/domain/ReservationStatusBadge'
import { PriceDisplay } from '@/components/domain/PriceDisplay'

// ---- モックデータ ----

const mockReservation = {
  id: 'rsv-001',
  roomName: '大会議室A（渋谷）',
  date: '2026年4月20日（月）',
  timeStart: '13:00',
  timeEnd: '15:00',
  pricePerHour: 5000,
  totalPrice: 10000,
  status: 'approved' as const,
}

// ---- ページコンポーネント ----

interface ReservationCancelPageProps {
  modalOpen?: boolean
  cancelFee?: number
  loading?: boolean
  cancelled?: boolean
}

const ReservationCancelPage: React.FC<ReservationCancelPageProps> = ({
  modalOpen = false,
  cancelFee = 3000,
  loading = false,
  cancelled = false,
}) => {
  const [isOpen, setIsOpen] = useState(modalOpen)

  if (cancelled) {
    return (
      <div style={{ maxWidth: 1280 }} className="mx-auto px-[var(--space-6)] py-[var(--space-8)]">
        <Card className="text-center py-[var(--space-12)]">
          <Icon name="calendar" size={48} className="mx-auto mb-[var(--space-4)]" />
          <h2 className="text-[var(--text-xl)] font-[var(--font-semibold)] mb-[var(--space-2)]" style={{ color: 'var(--foreground)' }}>
            予約を取り消しました
          </h2>
          <p className="text-[var(--text-sm)] mb-[var(--space-6)]" style={{ color: 'var(--foreground-secondary)' }}>
            キャンセル処理が完了しました。
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
            予約詳細
          </h1>
        </div>

        {/* 予約詳細カード */}
        <Card>
          <div className="flex items-center justify-between mb-[var(--space-4)]">
            <h2 className="text-[var(--text-lg)] font-[var(--font-semibold)]" style={{ color: 'var(--foreground)' }}>
              {mockReservation.roomName}
            </h2>
            <ReservationStatusBadge status={mockReservation.status} />
          </div>
          <div className="flex flex-col gap-[var(--space-3)] text-[var(--text-sm)]" style={{ color: 'var(--foreground-secondary)' }}>
            <div className="flex items-center gap-[var(--space-2)]">
              <Icon name="calendar" size={16} />
              <span>{mockReservation.date}</span>
            </div>
            <div className="flex items-center gap-[var(--space-2)]">
              <Icon name="clock" size={16} />
              <span>{mockReservation.timeStart} 〜 {mockReservation.timeEnd}</span>
            </div>
            <div className="flex items-center justify-between pt-[var(--space-3)] border-t border-[var(--border)]">
              <span>利用料金合計</span>
              <PriceDisplay amount={mockReservation.totalPrice} unit="hour" size="sm" />
            </div>
          </div>

          <div className="mt-[var(--space-6)] flex justify-end">
            <Button variant="destructive" onClick={() => setIsOpen(true)}>
              取消する
            </Button>
          </div>
        </Card>

        {/* キャンセル確認モーダル（オーバーレイ） */}
        {isOpen && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ background: 'rgba(0,0,0,0.4)' }}
          >
            <div style={{ width: 560, maxWidth: '90vw' }}>
              <Card>
                <div className="flex items-center gap-[var(--space-3)] mb-[var(--space-4)]">
                  <Icon name="shield-check" size={24} />
                  <h2 className="text-[var(--text-xl)] font-[var(--font-bold)]" style={{ color: 'var(--foreground)' }}>
                    予約取消の確認
                  </h2>
                </div>

                {/* 予約サマリー */}
                <div
                  className="p-[var(--space-4)] rounded-[var(--radius-lg)] mb-[var(--space-4)]"
                  style={{ background: 'var(--muted)' }}
                >
                  <div className="flex flex-col gap-[var(--space-2)] text-[var(--text-sm)]">
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--foreground-secondary)' }}>会議室</span>
                      <span style={{ color: 'var(--foreground)' }}>{mockReservation.roomName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--foreground-secondary)' }}>日時</span>
                      <span style={{ color: 'var(--foreground)' }}>
                        {mockReservation.date} {mockReservation.timeStart}〜{mockReservation.timeEnd}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--foreground-secondary)' }}>利用料金</span>
                      <PriceDisplay amount={mockReservation.totalPrice} size="sm" />
                    </div>
                  </div>
                </div>

                {/* キャンセル料 */}
                <div
                  className="p-[var(--space-4)] rounded-[var(--radius-lg)] border mb-[var(--space-4)]"
                  style={{
                    borderColor: cancelFee > 0 ? 'var(--destructive)' : 'var(--border)',
                    background: cancelFee > 0 ? 'var(--destructive-light)' : 'var(--muted)',
                  }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--text-sm)] font-[var(--font-semibold)]" style={{ color: 'var(--foreground)' }}>
                      キャンセル料
                    </span>
                    {cancelFee === 0 ? (
                      <span className="text-[var(--text-sm)]" style={{ color: 'var(--color-green-700)' }}>
                        ¥0（無料）
                      </span>
                    ) : (
                      <PriceDisplay amount={cancelFee} size="sm" />
                    )}
                  </div>
                  <p className="text-[var(--text-xs)] mt-[var(--space-1)]" style={{ color: 'var(--foreground-secondary)' }}>
                    {cancelFee === 0
                      ? 'キャンセル期限内のため、キャンセル料は発生しません。'
                      : '利用日の3日前を過ぎているため、キャンセル料が発生します。'}
                  </p>
                </div>

                <div className="flex gap-[var(--space-3)] justify-end">
                  <Button variant="ghost" onClick={() => setIsOpen(false)}>
                    戻る
                  </Button>
                  <Button variant="destructive" loading={loading}>
                    取消する
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ---- Meta ----

const meta: Meta<typeof ReservationCancelPage> = {
  title: 'Pages/利用者/予約取消',
  component: ReservationCancelPage,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof ReservationCancelPage>

// ---- Stories ----

export const Default: Story = {
  args: {
    modalOpen: false,
    cancelFee: 3000,
    loading: false,
    cancelled: false,
  },
}

export const ModalOpen: Story = {
  args: {
    modalOpen: true,
    cancelFee: 3000,
    loading: false,
    cancelled: false,
  },
}

export const FreeCancellation: Story = {
  args: {
    modalOpen: true,
    cancelFee: 0,
    loading: false,
    cancelled: false,
  },
}

export const Processing: Story = {
  args: {
    modalOpen: true,
    cancelFee: 3000,
    loading: true,
    cancelled: false,
  },
}

export const Cancelled: Story = {
  args: {
    modalOpen: false,
    cancelFee: 0,
    loading: false,
    cancelled: true,
  },
}
