import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React, { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { InquiryThread, type Message } from '@/components/domain/InquiryThread'

// ---- モックデータ ----

const categoryOptions = [
  { value: 'usage', label: '使い方' },
  { value: 'reservation', label: '予約・変更・取消' },
  { value: 'billing', label: '請求・精算' },
  { value: 'technical', label: '技術的な問題' },
  { value: 'other', label: 'その他' },
]

const mockPastMessages: Message[] = [
  {
    id: 'msg-001',
    sender: '田中太郎',
    senderRole: 'user',
    content: '決済が完了しているはずなのに予約状態が「申請中」のままです。',
    timestamp: '2026-03-10 09:15',
  },
  {
    id: 'msg-002',
    sender: 'サポートチーム',
    senderRole: 'admin',
    content: 'お問合せありがとうございます。ご確認いたします。しばらくお待ちください。',
    timestamp: '2026-03-10 11:30',
  },
  {
    id: 'msg-003',
    sender: 'サポートチーム',
    senderRole: 'admin',
    content: '確認が完了しました。決済処理は正常に完了しておりますが、ステータス更新に遅延が発生しておりました。現在は正常に更新されております。ご不便をおかけし申し訳ございません。',
    timestamp: '2026-03-10 14:00',
  },
]

// ---- ページコンポーネント ----

interface InquiryToServicePageProps {
  loading?: boolean
  submitted?: boolean
  showError?: boolean
  hasPastInquiries?: boolean
}

const InquiryToServicePage: React.FC<InquiryToServicePageProps> = ({
  loading = false,
  submitted = false,
  showError = false,
  hasPastInquiries = false,
}) => {
  const [category, setCategory] = useState('')
  const [content, setContent] = useState('')
  const [contentError, setContentError] = useState(showError ? '問合せ内容を入力してください' : '')

  if (submitted) {
    return (
      <div style={{ maxWidth: 1280 }} className="mx-auto px-[var(--space-6)] py-[var(--space-8)]">
        <div className="flex flex-col gap-[var(--space-4)]" style={{ maxWidth: 720 }}>
          <h1 className="text-[var(--text-2xl)] font-[var(--font-bold)]" style={{ color: 'var(--foreground)' }}>
            サービスへのお問合せ
          </h1>
          <div
            className="flex flex-col gap-[var(--space-4)] p-[var(--space-6)] rounded-[var(--radius-lg)] border"
            style={{ borderColor: 'var(--color-green-700)', background: 'var(--success-light)' }}
          >
            <div className="flex items-center gap-[var(--space-3)]">
              <Icon name="shield-check" size={24} />
              <h2 className="text-[var(--text-lg)] font-[var(--font-semibold)]" style={{ color: 'var(--color-green-700)' }}>
                お問合せを受け付けました
              </h2>
            </div>
            <p className="text-[var(--text-sm)]" style={{ color: 'var(--foreground-secondary)' }}>
              担当者が確認次第、ご登録のメールアドレスへ回答いたします。
            </p>
            <Button variant="outline" size="sm" className="self-start">
              問合せ履歴を確認する
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1280 }} className="mx-auto px-[var(--space-6)] py-[var(--space-8)]">
      <div className="flex flex-col gap-[var(--space-6)]" style={{ maxWidth: 720 }}>
        {/* ページタイトル */}
        <h1 className="text-[var(--text-2xl)] font-[var(--font-bold)]" style={{ color: 'var(--foreground)' }}>
          サービスへのお問合せ
        </h1>

        {/* 問合せフォーム */}
        <Card>
          <div className="flex flex-col gap-[var(--space-5)]">
            {/* カテゴリー選択 */}
            <div className="flex flex-col gap-[var(--space-1-5)]">
              <label className="text-[var(--text-sm)] font-[var(--font-medium)]" style={{ color: 'var(--foreground)' }}>
                問合せカテゴリー
              </label>
              <select
                className={[
                  'h-[var(--input-height)] px-[var(--input-px)]',
                  'rounded-[var(--input-radius)] border',
                  'text-[var(--input-font-size)] bg-[var(--background)]',
                  'border-[var(--input-border)] focus:outline-2 focus:outline-[var(--input-focus-ring)]',
                ].join(' ')}
                style={{ color: category ? 'var(--foreground)' : 'var(--foreground-muted)' }}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">カテゴリーを選択してください</option>
                {categoryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* 問合せ内容 */}
            <div className="flex flex-col gap-[var(--space-1-5)]">
              <label className="text-[var(--text-sm)] font-[var(--font-medium)]" style={{ color: 'var(--foreground)' }}>
                問合せ内容
              </label>
              <textarea
                className={[
                  'w-full px-[var(--input-px)] py-[var(--input-py)] rounded-[var(--input-radius)]',
                  'border text-[var(--input-font-size)]',
                  'bg-[var(--background)] text-[color:var(--foreground)]',
                  'placeholder:text-[color:var(--foreground-muted)]',
                  'focus:outline-2 resize-none',
                  contentError
                    ? 'border-[var(--destructive)] focus:outline-[var(--destructive)]'
                    : 'border-[var(--input-border)] focus:outline-[var(--input-focus-ring)]',
                ].join(' ')}
                rows={6}
                placeholder="お問合せ内容をご記入ください（1〜1000文字）"
                value={content}
                onChange={(e) => {
                  setContent(e.target.value)
                  if (e.target.value) setContentError('')
                }}
                maxLength={1000}
              />
              <div className="flex justify-between items-center">
                {contentError ? (
                  <p className="text-[var(--text-xs)]" style={{ color: 'var(--destructive)' }}>{contentError}</p>
                ) : (
                  <span />
                )}
                <p className="text-[var(--text-xs)]" style={{ color: 'var(--foreground-muted)' }}>
                  {content.length}/1000文字
                </p>
              </div>
            </div>

            {/* 添付ファイル */}
            <div className="flex flex-col gap-[var(--space-1-5)]">
              <label className="text-[var(--text-sm)] font-[var(--font-medium)]" style={{ color: 'var(--foreground)' }}>
                添付ファイル（任意）
              </label>
              <div
                className="flex items-center justify-center p-[var(--space-6)] rounded-[var(--radius-lg)] border-2 border-dashed cursor-pointer hover:opacity-80 transition-opacity"
                style={{ borderColor: 'var(--border)', background: 'var(--muted)' }}
              >
                <div className="flex flex-col items-center gap-[var(--space-2)]">
                  <Icon name="settings" size={24} />
                  <p className="text-[var(--text-sm)]" style={{ color: 'var(--foreground-secondary)' }}>
                    ファイルをドラッグ&amp;ドロップまたはクリックして選択
                  </p>
                  <p className="text-[var(--text-xs)]" style={{ color: 'var(--foreground-muted)' }}>
                    jpg / png / pdf（5MB以内）
                  </p>
                </div>
              </div>
            </div>

            <Button variant="default" size="lg" loading={loading} className="w-full">
              送信
            </Button>
          </div>
        </Card>

        {/* 過去の問合せ */}
        {hasPastInquiries && (
          <div>
            <h2 className="text-[var(--text-lg)] font-[var(--font-semibold)] mb-[var(--space-4)]" style={{ color: 'var(--foreground)' }}>
              問合せ履歴
            </h2>
            <InquiryThread messages={mockPastMessages} />
          </div>
        )}
      </div>
    </div>
  )
}

// ---- Meta ----

const meta: Meta<typeof InquiryToServicePage> = {
  title: 'Pages/利用者/サービスへ問合せ',
  component: InquiryToServicePage,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof InquiryToServicePage>

// ---- Stories ----

export const Default: Story = {
  args: {
    loading: false,
    submitted: false,
    showError: false,
    hasPastInquiries: false,
  },
}

export const WithPastInquiries: Story = {
  args: {
    loading: false,
    submitted: false,
    showError: false,
    hasPastInquiries: true,
  },
}

export const WithValidationError: Story = {
  args: {
    loading: false,
    submitted: false,
    showError: true,
    hasPastInquiries: false,
  },
}

export const Loading: Story = {
  args: {
    loading: true,
    submitted: false,
    showError: false,
    hasPastInquiries: false,
  },
}

export const Submitted: Story = {
  args: {
    loading: false,
    submitted: true,
    showError: false,
    hasPastInquiries: false,
  },
}
