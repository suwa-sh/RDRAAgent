import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React, { useState } from 'react'
import { OwnerLayout } from '@/components/layout/OwnerLayout'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'

// ---- 確認ダイアログコンポーネント ----

interface ConfirmDialogProps {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ open, onConfirm, onCancel }) => {
  if (!open) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: 'var(--card-bg)',
          borderRadius: 'var(--card-radius)',
          padding: 'var(--space-6)',
          maxWidth: 440,
          width: '90%',
          boxShadow: 'var(--card-shadow-hover)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-5)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'var(--destructive-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 'var(--space-2)',
            }}
          >
            <Icon name="shield-check" size={24} />
          </div>
          <h3
            style={{
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-bold)',
              color: 'var(--foreground)',
              margin: 0,
            }}
          >
            退会を確定しますか？
          </h3>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)', margin: 0, lineHeight: 1.7 }}>
            この操作は取り消せません。アカウントと全ての会議室情報が完全に削除されます。
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
          <Button variant="outline" size="md" onClick={onCancel}>
            キャンセル
          </Button>
          <Button variant="destructive" size="md" onClick={onConfirm}>
            退会する
          </Button>
        </div>
      </div>
    </div>
  )
}

// ---- ページコンポーネント ----

interface WithdrawalPageProps {
  confirmed?: boolean
}

const WithdrawalPage: React.FC<WithdrawalPageProps> = ({ confirmed = false }) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(confirmed)
  const [agreed, setAgreed] = useState(false)
  const [reason, setReason] = useState('')

  const reasons = [
    { id: 'no-use', label: '会議室を利用しなくなった' },
    { id: 'too-expensive', label: '手数料が高い' },
    { id: 'service-issue', label: 'サービスへの不満' },
    { id: 'other', label: 'その他' },
  ]

  const handleConfirm = () => {
    setDialogOpen(false)
    setIsConfirmed(true)
  }

  if (isConfirmed) {
    return (
      <OwnerLayout
        breadcrumbs={[
          { label: 'ダッシュボード', href: '/owner' },
          { label: '退会申請' },
        ]}
      >
        <div
          style={{
            maxWidth: 560,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-6)',
            margin: '0 auto',
            paddingTop: 'var(--space-8)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'var(--muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="user" size={40} />
          </div>
          <div>
            <h1
              style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: 'var(--font-bold)',
                color: 'var(--foreground)',
                margin: 0,
              }}
            >
              退会申請を受け付けました
            </h1>
            <p
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--foreground-secondary)',
                marginTop: 'var(--space-2)',
                lineHeight: 1.7,
              }}
            >
              退会処理は最大5営業日以内に完了します。処理完了後にご登録のメールアドレスへ通知いたします。
            </p>
          </div>
        </div>
      </OwnerLayout>
    )
  }

  return (
    <OwnerLayout
      breadcrumbs={[
        { label: 'ダッシュボード', href: '/owner' },
        { label: '退会申請' },
      ]}
    >
      <div style={{ maxWidth: 600, display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
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
            退会申請
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)', marginTop: 'var(--space-1)' }}>
            退会のお手続きを行います
          </p>
        </div>

        {/* 注意事項 */}
        <div
          style={{
            background: 'var(--destructive-light)',
            border: '1px solid var(--destructive)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-4)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-3)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-red-700)' }}>
            <Icon name="shield-check" size={18} />
            <span style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)' }}>
              退会する前にご確認ください
            </span>
          </div>
          <ul
            style={{
              margin: 0,
              paddingLeft: 'var(--space-5)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-1)',
              fontSize: 'var(--text-sm)',
              color: 'var(--color-red-700)',
            }}
          >
            <li>登録済みの会議室情報はすべて削除されます</li>
            <li>未完了の予約・精算がある場合は退会できません</li>
            <li>退会後はデータを復元できません</li>
            <li>精算未払い残高がある場合は先に精算が必要です</li>
          </ul>
        </div>

        {/* 退会理由 */}
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <h2
              style={{
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-semibold)',
                color: 'var(--foreground)',
                margin: 0,
              }}
            >
              退会理由（任意）
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {reasons.map((r) => (
                <label
                  key={r.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    cursor: 'pointer',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--foreground)',
                    padding: 'var(--space-2)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <input
                    type="radio"
                    name="reason"
                    value={r.id}
                    onChange={() => setReason(r.id)}
                    checked={reason === r.id}
                    style={{ accentColor: 'var(--primary)', width: 16, height: 16 }}
                  />
                  {r.label}
                </label>
              ))}
            </div>
          </div>
        </Card>

        {/* 確認チェックボックス */}
        <Card>
          <label
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 'var(--space-3)',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              style={{ accentColor: 'var(--destructive)', width: 18, height: 18, marginTop: 2, flexShrink: 0 }}
            />
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)', lineHeight: 1.7 }}>
              上記の注意事項を確認し、退会によってアカウントと全データが削除されることに同意します
            </span>
          </label>
        </Card>

        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
          <Button variant="outline" size="md">キャンセル</Button>
          <Button
            variant="destructive"
            size="md"
            disabled={!agreed}
            onClick={() => setDialogOpen(true)}
          >
            退会申請を送信
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={dialogOpen}
        onConfirm={handleConfirm}
        onCancel={() => setDialogOpen(false)}
      />
    </OwnerLayout>
  )
}

// ---- Meta ----

const meta: Meta<typeof WithdrawalPage> = {
  title: 'Pages/オーナー/退会申請',
  component: WithdrawalPage,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof WithdrawalPage>

export const Default: Story = { args: { confirmed: false } }
export const Confirmed: Story = { args: { confirmed: true } }
