import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React, { useState } from 'react'
import { OwnerLayout } from '@/components/layout/OwnerLayout'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { OwnerVerificationBadge } from '@/components/domain/OwnerVerificationBadge'
import { Icon } from '@/components/ui/Icon'

// ---- モックデータ ----

const mockProfile = {
  lastName: '山田',
  firstName: '花子',
  email: 'hanako.yamada@example.com',
  phone: '090-1234-5678',
  companyName: '山田不動産',
  address: '東京都渋谷区桜丘町1-2',
  website: 'https://yamada-property.example.com',
}

// ---- ページコンポーネント ----

interface OwnerProfileEditPageProps {
  saved?: boolean
  verificationStatus?: 'verified' | 'under-review' | 'unverified'
}

const OwnerProfileEditPage: React.FC<OwnerProfileEditPageProps> = ({
  saved = false,
  verificationStatus = 'verified',
}) => {
  const [form, setForm] = useState(mockProfile)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  return (
    <OwnerLayout
      breadcrumbs={[
        { label: 'ダッシュボード', href: '/owner' },
        { label: 'オーナー情報変更' },
      ]}
      userName={`${form.lastName} ${form.firstName}`}
    >
      <div style={{ maxWidth: 680, display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {/* ページタイトル */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <div>
            <h1
              style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: 'var(--font-bold)',
                color: 'var(--foreground)',
                margin: 0,
              }}
            >
              オーナー情報変更
            </h1>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)', marginTop: 'var(--space-1)' }}>
              アカウントの基本情報を編集します
            </p>
          </div>
          <OwnerVerificationBadge status={verificationStatus} />
        </div>

        {saved && (
          <div
            style={{
              background: 'var(--success-light)',
              border: '1px solid var(--success)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-3) var(--space-4)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              color: 'var(--color-green-700)',
              fontSize: 'var(--text-sm)',
            }}
          >
            <Icon name="shield-check" size={16} />
            オーナー情報を更新しました
          </div>
        )}

        {/* アバター */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: 'var(--primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'var(--text-2xl)',
                fontWeight: 'var(--font-bold)',
                color: 'var(--primary)',
                flexShrink: 0,
              }}
            >
              {form.lastName[0]}
            </div>
            <div>
              <p style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--foreground)', margin: 0 }}>
                {form.lastName} {form.firstName}
              </p>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)', marginTop: 2 }}>
                {form.email}
              </p>
            </div>
          </div>
        </Card>

        {/* 基本情報 */}
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <h2
              style={{
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-semibold)',
                color: 'var(--foreground)',
                margin: 0,
                paddingBottom: 'var(--space-3)',
                borderBottom: '1px solid var(--border)',
              }}
            >
              基本情報
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <Input
                label="姓"
                value={form.lastName}
                onChange={handleChange('lastName')}
                placeholder="山田"
              />
              <Input
                label="名"
                value={form.firstName}
                onChange={handleChange('firstName')}
                placeholder="花子"
              />
            </div>

            <Input
              label="メールアドレス"
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              placeholder="example@email.com"
            />

            <Input
              label="電話番号"
              type="tel"
              value={form.phone}
              onChange={handleChange('phone')}
              placeholder="090-0000-0000"
            />

            <Input
              label="会社名・組織名（任意）"
              value={form.companyName}
              onChange={handleChange('companyName')}
              placeholder="例: 山田不動産"
            />

            <Input
              label="住所"
              value={form.address}
              onChange={handleChange('address')}
              placeholder="例: 東京都渋谷区桜丘町1-2"
            />

            <Input
              label="ウェブサイト（任意）"
              type="url"
              value={form.website}
              onChange={handleChange('website')}
              placeholder="https://example.com"
            />
          </div>
        </Card>

        {/* パスワード変更 */}
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <h2
              style={{
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-semibold)',
                color: 'var(--foreground)',
                margin: 0,
                paddingBottom: 'var(--space-3)',
                borderBottom: '1px solid var(--border)',
              }}
            >
              パスワード変更
            </h2>

            <Input
              label="現在のパスワード"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="現在のパスワードを入力"
            />

            <Input
              label="新しいパスワード"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="8文字以上の新しいパスワード"
            />

            <Input
              label="新しいパスワード（確認）"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="もう一度入力してください"
              error={
                confirmPassword && newPassword !== confirmPassword
                  ? 'パスワードが一致しません'
                  : undefined
              }
            />
          </div>
        </Card>

        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
          <Button variant="outline" size="md">キャンセル</Button>
          <Button variant="default" size="md">
            <Icon name="shield-check" size={16} />
            変更を保存
          </Button>
        </div>
      </div>
    </OwnerLayout>
  )
}

// ---- Meta ----

const meta: Meta<typeof OwnerProfileEditPage> = {
  title: 'Pages/オーナー/オーナー情報変更',
  component: OwnerProfileEditPage,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof OwnerProfileEditPage>

export const Default: Story = { args: { saved: false, verificationStatus: 'verified' } }
export const Saved: Story = { args: { saved: true, verificationStatus: 'verified' } }
export const UnderReview: Story = { args: { saved: false, verificationStatus: 'under-review' } }
