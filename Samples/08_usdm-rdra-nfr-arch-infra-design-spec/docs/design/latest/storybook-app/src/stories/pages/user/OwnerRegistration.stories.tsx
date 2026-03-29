import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React, { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Icon } from '@/components/ui/Icon'

// ---- ページコンポーネント ----

interface OwnerRegistrationPageProps {
  loading?: boolean
  submitted?: boolean
  emailError?: boolean
  duplicateEmail?: boolean
}

const OwnerRegistrationPage: React.FC<OwnerRegistrationPageProps> = ({
  loading = false,
  submitted = false,
  emailError = false,
  duplicateEmail = false,
}) => {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<{ name?: string; phone?: string; email?: string }>({
    email: emailError ? '有効なメールアドレスを入力してください' : undefined,
  })

  const isFormValid = name.trim() !== '' && phone.trim() !== '' && email.trim() !== ''

  if (submitted) {
    return (
      <div style={{ maxWidth: 1280 }} className="mx-auto px-[var(--space-6)] py-[var(--space-8)]">
        <div className="flex flex-col gap-[var(--space-4)]" style={{ maxWidth: 560 }}>
          <h1 className="text-[var(--text-2xl)] font-[var(--font-bold)]" style={{ color: 'var(--foreground)' }}>
            オーナー登録申請
          </h1>
          <Card className="text-center py-[var(--space-10)]">
            <Icon name="shield-check" size={48} className="mx-auto mb-[var(--space-4)]" />
            <h2 className="text-[var(--text-xl)] font-[var(--font-semibold)] mb-[var(--space-2)]" style={{ color: 'var(--foreground)' }}>
              申請を受け付けました
            </h2>
            <p className="text-[var(--text-sm)] mb-[var(--space-2)]" style={{ color: 'var(--foreground-secondary)' }}>
              登録申請を受け付けました。審査完了後にご登録のメールアドレスへご連絡いたします。
            </p>
            <p className="text-[var(--text-xs)]" style={{ color: 'var(--foreground-muted)' }}>
              審査には通常3〜5営業日かかります。
            </p>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1280 }} className="mx-auto px-[var(--space-6)] py-[var(--space-8)]">
      <div className="flex flex-col gap-[var(--space-6)]" style={{ maxWidth: 560 }}>
        {/* ページタイトル */}
        <div>
          <h1 className="text-[var(--text-2xl)] font-[var(--font-bold)]" style={{ color: 'var(--foreground)' }}>
            オーナー登録申請
          </h1>
          <p className="text-[var(--text-sm)] mt-[var(--space-1)]" style={{ color: 'var(--foreground-secondary)' }}>
            会議室のオーナーとして登録申請を行います。
          </p>
        </div>

        {/* 重複エラーアラート */}
        {duplicateEmail && (
          <div
            className="flex items-center gap-[var(--space-3)] p-[var(--space-4)] rounded-[var(--radius-lg)] border"
            style={{ borderColor: 'var(--destructive)', background: 'var(--destructive-light)' }}
          >
            <Icon name="shield-check" size={16} />
            <p className="text-[var(--text-sm)]" style={{ color: 'var(--color-red-700)' }}>
              このメールアドレスは既に登録されています。
            </p>
          </div>
        )}

        <Card>
          <div className="flex flex-col gap-[var(--space-5)]">
            {/* 氏名 */}
            <Input
              label="氏名"
              type="text"
              placeholder="例: 田中 一郎"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setErrors((prev) => ({ ...prev, name: undefined }))
              }}
              error={errors.name}
              maxLength={50}
            />
            {errors.name && (
              <Badge variant="destructive">{errors.name}</Badge>
            )}

            {/* 連絡先 */}
            <Input
              label="連絡先（電話番号）"
              type="tel"
              placeholder="例: 090-1234-5678"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value)
                setErrors((prev) => ({ ...prev, phone: undefined }))
              }}
              error={errors.phone}
            />
            {errors.phone && (
              <Badge variant="destructive">{errors.phone}</Badge>
            )}

            {/* メールアドレス */}
            <Input
              label="メールアドレス"
              type="email"
              placeholder="例: tanaka@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setErrors((prev) => ({ ...prev, email: undefined }))
              }}
              error={errors.email}
            />
            {errors.email && (
              <Badge variant="destructive">{errors.email}</Badge>
            )}

            {/* 注意事項 */}
            <div
              className="p-[var(--space-4)] rounded-[var(--radius-lg)]"
              style={{ background: 'var(--muted)' }}
            >
              <p className="text-[var(--text-xs)]" style={{ color: 'var(--foreground-secondary)' }}>
                申請後、事務局が内容を確認し、審査結果をメールにてご連絡いたします。
                審査には3〜5営業日かかる場合があります。
              </p>
            </div>

            {/* 申請ボタン */}
            <Button
              variant="default"
              size="lg"
              loading={loading}
              disabled={!isFormValid}
              className="w-full"
            >
              申請する
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

// ---- Meta ----

const meta: Meta<typeof OwnerRegistrationPage> = {
  title: 'Pages/利用者/オーナー登録申請',
  component: OwnerRegistrationPage,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof OwnerRegistrationPage>

// ---- Stories ----

export const Default: Story = {
  args: {
    loading: false,
    submitted: false,
    emailError: false,
    duplicateEmail: false,
  },
}

export const WithEmailValidationError: Story = {
  args: {
    loading: false,
    submitted: false,
    emailError: true,
    duplicateEmail: false,
  },
}

export const WithDuplicateEmailError: Story = {
  args: {
    loading: false,
    submitted: false,
    emailError: false,
    duplicateEmail: true,
  },
}

export const Loading: Story = {
  args: {
    loading: true,
    submitted: false,
    emailError: false,
    duplicateEmail: false,
  },
}

export const Submitted: Story = {
  args: {
    loading: false,
    submitted: true,
    emailError: false,
    duplicateEmail: false,
  },
}
