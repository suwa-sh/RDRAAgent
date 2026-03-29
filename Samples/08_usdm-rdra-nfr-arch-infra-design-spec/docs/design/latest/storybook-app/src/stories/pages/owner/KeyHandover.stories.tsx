import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { OwnerLayout } from '@/components/layout/OwnerLayout'
import { KeyHandoverTracker, type KeyStep } from '@/components/domain/KeyHandoverTracker'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'

/* ------------------------------------------------------------------ */
/* Types                                                                */
/* ------------------------------------------------------------------ */

interface ReservationSummary {
  id: string
  roomName: string
  userName: string
  startAt: string
  endAt: string
}

/* ------------------------------------------------------------------ */
/* Inner component                                                       */
/* ------------------------------------------------------------------ */

const KeyHandoverPage: React.FC<{
  reservation: ReservationSummary
  initialStep?: KeyStep
}> = ({ reservation, initialStep = 'lent' }) => {
  const [step, setStep] = useState<KeyStep>(initialStep)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleKeyOut = () => {
    setShowConfirm(true)
  }

  const handleConfirm = () => {
    setShowConfirm(false)
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setStep('in-use')
    }, 1200)
  }

  const handleCancel = () => {
    setShowConfirm(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 560 }}>
      {/* Page title */}
      <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--foreground)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon name="key" size={22} />
        鍵貸出記録
      </h1>

      {/* Key status tracker */}
      <KeyHandoverTracker
        currentStep={step}
        lentAt={step !== 'lent' ? '2026年3月29日 10:00' : undefined}
        returnDue="2026年3月29日 18:00"
        returnedAt={step === 'returned' ? '2026年3月29日 17:45' : undefined}
      />

      {/* Reservation info card */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Icon name="calendar" size={18} />
          <span style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--foreground)' }}>
            予約情報
          </span>
        </div>
        <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px 16px' }}>
          {[
            ['予約ID', reservation.id],
            ['会議室', reservation.roomName],
            ['利用者', reservation.userName],
            ['利用開始', reservation.startAt],
            ['利用終了', reservation.endAt],
          ].map(([label, value]) => (
            <React.Fragment key={label}>
              <dt style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)', whiteSpace: 'nowrap' }}>{label}</dt>
              <dd style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)', margin: 0 }}>{value}</dd>
            </React.Fragment>
          ))}
        </dl>
      </Card>

      {/* Action area */}
      {step === 'lent' && (
        <div style={{ display: 'flex', gap: 12 }}>
          <Button
            variant="default"
            size="lg"
            loading={isSubmitting}
            onClick={handleKeyOut}
            style={{ background: '#0D9488' }}
          >
            <Icon name="key" size={18} />
            鍵を渡した
          </Button>
          <Button variant="outline" size="lg">
            戻る
          </Button>
        </div>
      )}

      {step === 'in-use' && (
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><polyline points="9 12 11 14 15 10" />
            </svg>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)', fontWeight: 'var(--font-medium)' }}>
              鍵を貸し出しました
            </span>
          </div>
          <div style={{ marginTop: 12 }}>
            <a
              href="/owner/rentals/R-001/key-in"
              style={{ fontSize: 'var(--text-sm)', color: '#0D9488', textDecoration: 'underline' }}
            >
              鍵返却記録画面へ
            </a>
          </div>
        </Card>
      )}

      {/* Confirm dialog overlay */}
      {showConfirm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'var(--modal-backdrop)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
        >
          <Card>
            <div style={{ minWidth: 320, padding: '8px 0' }}>
              <p style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--foreground)', marginBottom: 8 }}>
                鍵貸出の確認
              </p>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)', marginBottom: 20 }}>
                {reservation.userName}さんに鍵を渡しましたか？
              </p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <Button variant="outline" onClick={handleCancel}>
                  キャンセル
                </Button>
                <Button variant="default" onClick={handleConfirm} style={{ background: '#0D9488' }}>
                  記録する
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Story meta                                                            */
/* ------------------------------------------------------------------ */

const meta: Meta = {
  title: 'Pages/オーナー/鍵貸出記録',
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
            { label: '鍵貸出記録' },
          ]}
          notificationCount={1}
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

const defaultReservation: ReservationSummary = {
  id: 'R-2026-00147',
  roomName: '渋谷スカイルーム A',
  userName: '田中 太郎',
  startAt: '2026年3月29日（日） 10:00',
  endAt: '2026年3月29日（日） 18:00',
}

export const BeforeHandover: Story = {
  name: '貸出前（鍵貸出ボタン表示）',
  render: () => <KeyHandoverPage reservation={defaultReservation} initialStep="lent" />,
}

export const InUse: Story = {
  name: '貸出済（利用中）',
  render: () => <KeyHandoverPage reservation={defaultReservation} initialStep="in-use" />,
}

export const Returned: Story = {
  name: '返却済',
  render: () => <KeyHandoverPage reservation={defaultReservation} initialStep="returned" />,
}
