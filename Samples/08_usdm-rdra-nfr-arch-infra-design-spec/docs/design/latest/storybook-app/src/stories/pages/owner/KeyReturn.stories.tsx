import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React from 'react'
import { OwnerLayout } from '@/components/layout/OwnerLayout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { KeyHandoverTracker } from '@/components/domain/KeyHandoverTracker'
import { ReservationStatusBadge } from '@/components/domain/ReservationStatusBadge'
import { Icon } from '@/components/ui/Icon'

// ---- モックデータ ----

const mockReservation = {
  id: 'res-20260315-001',
  roomName: '大会議室A（渋谷）',
  userName: '田中太郎',
  date: '2026-03-15',
  timeStart: '14:00',
  timeEnd: '17:00',
  capacity: 8,
  notes: '商談用途。プロジェクターの事前準備をお願いします。',
}

// ---- ページコンポーネント ----

interface KeyReturnPageProps {
  keyStep?: 'lent' | 'in-use' | 'returned'
}

const KeyReturnPage: React.FC<KeyReturnPageProps> = ({ keyStep = 'in-use' }) => {
  const isReturned = keyStep === 'returned'

  return (
    <OwnerLayout
      breadcrumbs={[
        { label: 'ダッシュボード', href: '/owner' },
        { label: '予約管理', href: '/owner/reservations' },
        { label: '鍵返却記録' },
      ]}
    >
      <div style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {/* ページタイトル */}
        <div>
          <h1
            style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--font-bold)',
              color: 'var(--foreground)',
              margin: 0,
            }}
          >
            鍵返却記録
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)', marginTop: 'var(--space-1)' }}>
            利用者からの鍵の返却を記録します
          </p>
        </div>

        {/* 鍵ステータストラッカー */}
        <KeyHandoverTracker
          currentStep={keyStep}
          lentAt="2026-03-15 13:55"
          returnDue="2026-03-15 17:15"
          returnedAt={isReturned ? '2026-03-15 17:08' : undefined}
        />

        {/* 予約詳細 */}
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2
                style={{
                  fontSize: 'var(--text-base)',
                  fontWeight: 'var(--font-semibold)',
                  color: 'var(--foreground)',
                  margin: 0,
                }}
              >
                予約詳細
              </h2>
              <ReservationStatusBadge status={isReturned ? 'completed' : 'in-use'} />
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                gap: 'var(--space-2) var(--space-4)',
                fontSize: 'var(--text-sm)',
              }}
            >
              <span style={{ color: 'var(--foreground-secondary)', whiteSpace: 'nowrap' }}>予約ID</span>
              <span style={{ color: 'var(--foreground)', fontFamily: 'monospace' }}>{mockReservation.id}</span>

              <span style={{ color: 'var(--foreground-secondary)', whiteSpace: 'nowrap' }}>会議室</span>
              <span style={{ color: 'var(--foreground)', display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                <Icon name="room" size={14} />
                {mockReservation.roomName}
              </span>

              <span style={{ color: 'var(--foreground-secondary)', whiteSpace: 'nowrap' }}>利用者</span>
              <span style={{ color: 'var(--foreground)', display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                <Icon name="user" size={14} />
                {mockReservation.userName}
              </span>

              <span style={{ color: 'var(--foreground-secondary)', whiteSpace: 'nowrap' }}>利用日時</span>
              <span style={{ color: 'var(--foreground)', display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                <Icon name="clock" size={14} />
                {mockReservation.date} {mockReservation.timeStart} ~ {mockReservation.timeEnd}
              </span>

              <span style={{ color: 'var(--foreground-secondary)', whiteSpace: 'nowrap' }}>利用人数</span>
              <span style={{ color: 'var(--foreground)', display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                <Icon name="users" size={14} />
                {mockReservation.capacity}名
              </span>

              {mockReservation.notes && (
                <>
                  <span style={{ color: 'var(--foreground-secondary)', whiteSpace: 'nowrap' }}>備考</span>
                  <span style={{ color: 'var(--foreground)' }}>{mockReservation.notes}</span>
                </>
              )}
            </div>
          </div>
        </Card>

        {/* 返却ボタン */}
        {!isReturned && (
          <Card>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Icon name="key" size={20} />
                <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--foreground)', margin: 0 }}>
                  鍵の返却確認
                </h2>
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)', margin: 0 }}>
                利用者から鍵を受け取ったら、返却を記録してください。
              </p>
              <div
                style={{
                  background: 'var(--warning-light)',
                  border: '1px solid var(--color-amber-500)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-3)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-amber-500)',
                }}
              >
                返却予定時刻: 2026-03-15 17:15（現在 利用中）
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                <Button variant="outline" size="md">
                  問題を報告
                </Button>
                <Button variant="default" size="md">
                  <Icon name="key" size={16} />
                  返却済みとして記録
                </Button>
              </div>
            </div>
          </Card>
        )}

        {isReturned && (
          <div
            style={{
              background: 'var(--success-light)',
              border: '1px solid var(--success)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-4)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
            }}
          >
            <Icon name="shield-check" size={24} />
            <div>
              <p style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--color-green-700)', margin: 0 }}>
                返却が記録されました
              </p>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-green-700)', marginTop: 4 }}>
                2026-03-15 17:08 に返却を確認しました
              </p>
            </div>
          </div>
        )}
      </div>
    </OwnerLayout>
  )
}

// ---- Meta ----

const meta: Meta<typeof KeyReturnPage> = {
  title: 'Pages/オーナー/鍵返却記録',
  component: KeyReturnPage,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof KeyReturnPage>

export const InUse: Story = { args: { keyStep: 'in-use' } }
export const Lent: Story = { args: { keyStep: 'lent' } }
export const Returned: Story = { args: { keyStep: 'returned' } }
