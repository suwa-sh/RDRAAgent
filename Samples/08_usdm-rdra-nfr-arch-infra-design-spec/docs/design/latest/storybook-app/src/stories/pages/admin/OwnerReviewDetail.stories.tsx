import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { OwnerVerificationBadge, type OwnerStatus } from '@/components/domain/OwnerVerificationBadge'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'

/* ------------------------------------------------------------------ */
/* Types                                                                */
/* ------------------------------------------------------------------ */

interface OwnerData {
  id: string
  name: string
  email: string
  phone: string
  address: string
  appliedAt: string
  idDocumentType: string
}

/* ------------------------------------------------------------------ */
/* Inner component                                                       */
/* ------------------------------------------------------------------ */

const OwnerReviewDetailPage: React.FC<{
  ownerData: OwnerData
  initialStatus?: OwnerStatus
}> = ({ ownerData, initialStatus = 'unverified' }) => {
  const [status, setStatus] = useState<OwnerStatus>(initialStatus)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [resultBanner, setResultBanner] = useState<'approved' | 'rejected' | null>(null)

  const handleApprove = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setStatus('verified')
      setResultBanner('approved')
      setIsProcessing(false)
    }, 1000)
  }

  const handleRejectConfirm = () => {
    setIsProcessing(true)
    setShowRejectModal(false)
    setTimeout(() => {
      setStatus('rejected')
      setResultBanner('rejected')
      setIsProcessing(false)
    }, 1000)
  }

  const isDone = status === 'verified' || status === 'rejected'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 680 }}>
      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <h2
          style={{
            fontSize: 'var(--text-xl)',
            fontWeight: 'var(--font-bold)',
            color: 'var(--foreground)',
            margin: 0,
          }}
        >
          オーナー審査詳細
        </h2>
        <OwnerVerificationBadge status={status} />
      </div>

      {/* Result banner */}
      {resultBanner && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 16px',
            borderRadius: 'var(--radius-lg)',
            background: resultBanner === 'approved' ? 'var(--success-light)' : 'var(--destructive-light)',
          }}
        >
          {resultBanner === 'approved' ? (
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          )}
          <span
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-medium)',
              color: resultBanner === 'approved' ? 'var(--color-green-700)' : 'var(--color-red-700)',
            }}
          >
            {resultBanner === 'approved' ? '承認が完了しました' : '却下が完了しました'}
          </span>
        </div>
      )}

      {/* Applicant info card */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Icon name="user" size={18} />
          <span style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--foreground)' }}>
            申請者情報
          </span>
        </div>
        <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '10px 20px' }}>
          {[
            ['オーナーID', ownerData.id],
            ['氏名', ownerData.name],
            ['メールアドレス', ownerData.email],
            ['電話番号', ownerData.phone],
            ['住所', ownerData.address],
            ['本人確認書類', ownerData.idDocumentType],
            ['申請日時', ownerData.appliedAt],
          ].map(([label, value]) => (
            <React.Fragment key={label}>
              <dt
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--foreground-secondary)',
                  whiteSpace: 'nowrap',
                }}
              >
                {label}
              </dt>
              <dd style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)', margin: 0 }}>
                {value}
              </dd>
            </React.Fragment>
          ))}
        </dl>
      </Card>

      {/* Review action card */}
      {!isDone && (
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Icon name="shield-check" size={18} />
            <span style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--foreground)' }}>
              審査判定
            </span>
          </div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)', marginBottom: 16, marginTop: 0 }}>
            申請内容を確認の上、承認または却下を選択してください。
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <Button
              variant="default"
              size="md"
              loading={isProcessing}
              disabled={isProcessing}
              onClick={handleApprove}
            >
              承認する
            </Button>
            <Button
              variant="destructive"
              size="md"
              disabled={isProcessing}
              onClick={() => setShowRejectModal(true)}
            >
              却下する
            </Button>
          </div>
        </Card>
      )}

      {/* Reject confirmation modal (inline overlay) */}
      {showRejectModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
          }}
        >
          <div
            style={{
              background: 'var(--card-bg)',
              borderRadius: 'var(--card-radius)',
              padding: 'var(--space-6)',
              width: 560,
              maxWidth: '90vw',
              boxShadow: 'var(--card-shadow-hover)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--foreground)' }}>
                却下の確認
              </span>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)', marginBottom: 20 }}>
              本当に却下しますか？この操作を行うと、申請者に却下通知が送信されます。
            </p>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)', marginBottom: 20, fontWeight: 'var(--font-medium)' }}>
              対象: {ownerData.name}（{ownerData.id}）
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <Button variant="outline" onClick={() => setShowRejectModal(false)}>
                キャンセル
              </Button>
              <Button variant="destructive" onClick={handleRejectConfirm}>
                却下する
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Story meta                                                            */
/* ------------------------------------------------------------------ */

const meta: Meta = {
  title: 'Pages/管理者/オーナー審査詳細',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => {
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-portal', 'admin')
      }
      return (
        <AdminLayout pageTitle="オーナー審査詳細" activeNav="オーナー管理">
          <Story />
        </AdminLayout>
      )
    },
  ],
}

export default meta
type Story = StoryObj<typeof meta>

/* ------------------------------------------------------------------ */
/* Mock data                                                             */
/* ------------------------------------------------------------------ */

const defaultOwner: OwnerData = {
  id: 'OWN-2026-00031',
  name: '田中 一郎',
  email: 'ichiro.tanaka@example.com',
  phone: '090-1234-5678',
  address: '東京都渋谷区神南1-2-3 渋谷ビル802',
  idDocumentType: '運転免許証',
  appliedAt: '2026-03-28 14:32:15',
}

/* ------------------------------------------------------------------ */
/* Stories                                                              */
/* ------------------------------------------------------------------ */

export const Default: Story = {
  name: '未審査（審査待ち）',
  render: () => <OwnerReviewDetailPage ownerData={defaultOwner} initialStatus="unverified" />,
}

export const UnderReview: Story = {
  name: '審査中',
  render: () => (
    <OwnerReviewDetailPage
      ownerData={{
        ...defaultOwner,
        id: 'OWN-2026-00028',
        name: '佐藤 美咲',
        email: 'misaki.sato@example.com',
        phone: '080-9876-5432',
        appliedAt: '2026-03-27 09:15:42',
      }}
      initialStatus="under-review"
    />
  ),
}

export const AlreadyApproved: Story = {
  name: '承認済み（参照のみ）',
  render: () => (
    <OwnerReviewDetailPage
      ownerData={{
        ...defaultOwner,
        id: 'OWN-2026-00020',
        name: '鈴木 健二',
        email: 'kenji.suzuki@example.com',
        phone: '070-1111-2222',
        appliedAt: '2026-03-15 11:00:00',
      }}
      initialStatus="verified"
    />
  ),
}

export const AlreadyRejected: Story = {
  name: '却下済み（参照のみ）',
  render: () => (
    <OwnerReviewDetailPage
      ownerData={{
        ...defaultOwner,
        id: 'OWN-2026-00025',
        name: '伊藤 良子',
        email: 'yoshiko.ito@example.com',
        phone: '090-5555-6666',
        appliedAt: '2026-03-20 16:45:00',
      }}
      initialStatus="rejected"
    />
  ),
}
