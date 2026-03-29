import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { OwnerLayout } from '@/components/layout/OwnerLayout'
import { ReservationStatusBadge } from '@/components/domain/ReservationStatusBadge'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'

/* ------------------------------------------------------------------ */
/* Types                                                                */
/* ------------------------------------------------------------------ */

interface ReservationDetail {
  id: string
  roomName: string
  userName: string
  userRating: number
  reviewCount: number
  startAt: string
  endAt: string
  usageHours: number
  purpose: string
}

/* ------------------------------------------------------------------ */
/* Inner component                                                       */
/* ------------------------------------------------------------------ */

const ReservationReviewPage: React.FC<{ reservation: ReservationDetail }> = ({ reservation }) => {
  const [decision, setDecision] = useState<'approved' | 'rejected' | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [rejectReasonError, setRejectReasonError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleApprove = () => {
    setDecision('approved')
    setRejectReason('')
    setRejectReasonError('')
  }

  const handleReject = () => {
    setDecision('rejected')
    setRejectReasonError('')
  }

  const handleSubmit = () => {
    if (decision === 'rejected' && !rejectReason.trim()) {
      setRejectReasonError('拒否理由を入力してください')
      return
    }
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
    }, 1200)
  }

  const isLowRating = reservation.userRating <= 2.0

  if (submitted) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '32px 0' }}>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
            {decision === 'approved' ? (
              <svg width={48} height={48} viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><polyline points="9 12 11 14 15 10" />
              </svg>
            ) : (
              <svg width={48} height={48} viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            )}
          </div>
          <p style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', color: 'var(--foreground)', marginBottom: 8 }}>
            {decision === 'approved' ? '予約を許諾しました' : '予約を拒否しました'}
          </p>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)' }}>
            予約ID: {reservation.id}
          </p>
        </div>
      </Card>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 640 }}>
      {/* Page title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--foreground)', margin: 0 }}>
          予約審査
        </h1>
        <ReservationStatusBadge status="pending" />
      </div>

      {/* Reservation detail card */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Icon name="calendar" size={18} />
          <span style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--foreground)' }}>
            予約詳細
          </span>
        </div>
        <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px 16px' }}>
          {[
            ['予約ID', reservation.id],
            ['会議室', reservation.roomName],
            ['利用者', reservation.userName],
            ['利用開始', reservation.startAt],
            ['利用終了', reservation.endAt],
            ['利用時間', `${reservation.usageHours}時間`],
            ['利用目的', reservation.purpose],
          ].map(([label, value]) => (
            <React.Fragment key={label}>
              <dt style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)', whiteSpace: 'nowrap' }}>{label}</dt>
              <dd style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)', margin: 0 }}>{value}</dd>
            </React.Fragment>
          ))}
        </dl>
      </Card>

      {/* User rating card */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Icon name="star" size={18} />
          <span style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--foreground)' }}>
            利用者評価
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{ display: 'flex', gap: 2 }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <svg
                key={n}
                width={20}
                height={20}
                viewBox="0 0 24 24"
                fill={n <= Math.round(reservation.userRating) ? '#FBBF24' : 'none'}
                stroke="#FBBF24"
                strokeWidth={1.5}
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
          </div>
          <span style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--foreground)' }}>
            {reservation.userRating.toFixed(1)}
          </span>
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-muted)' }}>
            ({reservation.reviewCount}件)
          </span>
        </div>
        <button
          style={{
            background: 'transparent',
            border: 'none',
            padding: 0,
            fontSize: 'var(--text-sm)',
            color: '#0D9488',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          利用者の評価を確認する
        </button>

        {isLowRating && (
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Badge variant="warning">注意</Badge>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)' }}>
              評価スコアが2.0以下のため、拒否を推奨します
            </span>
          </div>
        )}
      </Card>

      {/* Decision area */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Icon name="shield-check" size={18} />
          <span style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--foreground)' }}>
            審査結果
          </span>
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: decision === 'rejected' ? 16 : 0 }}>
          <Button
            variant={decision === 'approved' ? 'default' : 'outline'}
            onClick={handleApprove}
            style={decision === 'approved' ? { background: '#0D9488' } : {}}
          >
            許諾する
          </Button>
          <Button
            variant={decision === 'rejected' ? 'destructive' : 'outline'}
            onClick={handleReject}
          >
            拒否する
          </Button>
        </div>

        {decision === 'rejected' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label
              htmlFor="reject-reason"
              style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--foreground)' }}
            >
              拒否理由
              <span style={{ color: '#DC2626', marginLeft: 4 }}>*</span>
            </label>
            <textarea
              id="reject-reason"
              value={rejectReason}
              onChange={(e) => {
                setRejectReason(e.target.value.slice(0, 200))
                if (e.target.value.trim()) setRejectReasonError('')
              }}
              placeholder="拒否理由を入力してください（最大200文字）"
              rows={4}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: `1px solid ${rejectReasonError ? '#DC2626' : 'var(--border)'}`,
                borderRadius: 'var(--radius-lg)',
                fontSize: 'var(--text-sm)',
                color: 'var(--foreground)',
                background: 'var(--card-bg)',
                resize: 'vertical',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {rejectReasonError ? (
                <span style={{ fontSize: 'var(--text-xs)', color: '#DC2626' }}>{rejectReasonError}</span>
              ) : (
                <span />
              )}
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground-muted)' }}>
                {rejectReason.length}/200
              </span>
            </div>
          </div>
        )}
      </Card>

      {/* Submit */}
      {decision !== null && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="default"
            size="lg"
            loading={isSubmitting}
            onClick={handleSubmit}
            style={{ background: '#0D9488' }}
          >
            {isSubmitting ? '送信中...' : '確定する'}
          </Button>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Story meta                                                            */
/* ------------------------------------------------------------------ */

const meta: Meta = {
  title: 'Pages/オーナー/予約審査',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => {
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-portal', 'owner')
      }
      return (
        <OwnerLayout
          breadcrumbs={[
            { label: 'ダッシュボード', href: '/owner' },
            { label: '予約管理', href: '/owner/reservations' },
            { label: '予約審査' },
          ]}
          notificationCount={3}
          userName="山田 花子"
        >
          <Story />
        </OwnerLayout>
      )
    },
  ],
}

export default meta
type Story = StoryObj<typeof meta>

/* ------------------------------------------------------------------ */
/* Stories                                                              */
/* ------------------------------------------------------------------ */

const defaultReservation: ReservationDetail = {
  id: 'R-2026-00147',
  roomName: '渋谷スカイルーム A',
  userName: '田中 太郎',
  userRating: 4.2,
  reviewCount: 18,
  startAt: '2026年4月5日（日） 10:00',
  endAt: '2026年4月5日（日） 13:00',
  usageHours: 3,
  purpose: '社内勉強会・ワークショップ',
}

export const Default: Story = {
  name: '標準（申請中）',
  render: () => <ReservationReviewPage reservation={defaultReservation} />,
}

export const LowRatingUser: Story = {
  name: '低評価ユーザー（拒否推奨）',
  render: () => (
    <ReservationReviewPage
      reservation={{
        ...defaultReservation,
        id: 'R-2026-00152',
        userName: '鈴木 一郎',
        userRating: 1.8,
        reviewCount: 5,
      }}
    />
  ),
}

export const NewUser: Story = {
  name: '新規ユーザー（評価なし）',
  render: () => (
    <ReservationReviewPage
      reservation={{
        ...defaultReservation,
        id: 'R-2026-00158',
        userName: '佐藤 美咲',
        userRating: 0,
        reviewCount: 0,
      }}
    />
  ),
}
