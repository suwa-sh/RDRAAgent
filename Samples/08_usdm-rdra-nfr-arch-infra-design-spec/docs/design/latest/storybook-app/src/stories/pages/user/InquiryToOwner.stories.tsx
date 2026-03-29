import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React, { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Icon } from '@/components/ui/Icon'
import { InquiryThread, type Message } from '@/components/domain/InquiryThread'

// ---- モックデータ ----

const mockRoom = {
  id: 'room-001',
  name: '大会議室A（渋谷）',
  ownerName: '山田一郎',
}

const mockMessages: Message[] = [
  {
    id: 'msg-001',
    sender: '田中太郎',
    senderRole: 'user',
    content: '駐車場はありますか？何台停められますか？',
    timestamp: '2026-03-25 14:30',
  },
  {
    id: 'msg-002',
    sender: '山田一郎',
    senderRole: 'owner',
    content: 'はい、地下に10台分の駐車スペースがあります。ご利用の場合は事前にお知らせください。',
    timestamp: '2026-03-25 16:45',
  },
  {
    id: 'msg-003',
    sender: '田中太郎',
    senderRole: 'user',
    content: 'プロジェクターの解像度はどのくらいですか？',
    timestamp: '2026-03-27 10:00',
  },
]

// ---- ページコンポーネント ----

interface InquiryToOwnerPageProps {
  loading?: boolean
  submitted?: boolean
  hasHistory?: boolean
  inputError?: boolean
}

const InquiryToOwnerPage: React.FC<InquiryToOwnerPageProps> = ({
  loading = false,
  submitted = false,
  hasHistory = true,
  inputError = false,
}) => {
  const [content, setContent] = useState('')
  const [error, setError] = useState(inputError ? '問合せ内容を入力してください' : '')

  if (submitted) {
    return (
      <div style={{ maxWidth: 1280 }} className="mx-auto px-[var(--space-6)] py-[var(--space-8)]">
        <Card className="text-center py-[var(--space-12)]">
          <Icon name="message" size={48} className="mx-auto mb-[var(--space-4)]" />
          <h2 className="text-[var(--text-xl)] font-[var(--font-semibold)] mb-[var(--space-2)]" style={{ color: 'var(--foreground)' }}>
            問合せを送信しました
          </h2>
          <p className="text-[var(--text-sm)] mb-[var(--space-6)]" style={{ color: 'var(--foreground-secondary)' }}>
            問合せを送信しました。オーナーからの回答をお待ちください。
          </p>
          <Button variant="outline">会議室詳細に戻る</Button>
        </Card>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1280 }} className="mx-auto px-[var(--space-6)] py-[var(--space-8)]">
      <div className="flex flex-col gap-[var(--space-6)]" style={{ maxWidth: 800 }}>
        {/* ページタイトル */}
        <div className="flex items-center gap-[var(--space-3)]">
          <Button variant="ghost" size="sm">
            <Icon name="map-pin" size={14} />
            戻る
          </Button>
          <div>
            <h1 className="text-[var(--text-2xl)] font-[var(--font-bold)]" style={{ color: 'var(--foreground)' }}>
              オーナーへ問合せ
            </h1>
            <p className="text-[var(--text-sm)]" style={{ color: 'var(--foreground-secondary)' }}>
              {mockRoom.name}
            </p>
          </div>
        </div>

        {/* オーナー情報 */}
        <div className="flex items-center gap-[var(--space-3)] p-[var(--space-4)] rounded-[var(--radius-lg)] border" style={{ borderColor: 'var(--border)' }}>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--text-base)] font-[var(--font-semibold)]"
            style={{ background: 'var(--muted)', color: 'var(--foreground)' }}
          >
            {mockRoom.ownerName[0]}
          </div>
          <div>
            <p className="text-[var(--text-sm)] font-[var(--font-semibold)]" style={{ color: 'var(--foreground)' }}>
              {mockRoom.ownerName}
            </p>
            <p className="text-[var(--text-xs)]" style={{ color: 'var(--foreground-secondary)' }}>オーナー</p>
          </div>
          <div className="ml-auto">
            <Badge variant="success">回答済み</Badge>
          </div>
        </div>

        {/* 問合せ履歴 */}
        {hasHistory && (
          <div>
            <h2 className="text-[var(--text-base)] font-[var(--font-semibold)] mb-[var(--space-3)]" style={{ color: 'var(--foreground)' }}>
              問合せ履歴
            </h2>
            <InquiryThread messages={mockMessages} />
          </div>
        )}

        {/* 新規問合せフォーム */}
        <Card>
          <h2 className="text-[var(--text-base)] font-[var(--font-semibold)] mb-[var(--space-4)]" style={{ color: 'var(--foreground)' }}>
            新しい問合せを送る
          </h2>
          <div className="flex flex-col gap-[var(--space-4)]">
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
                  error
                    ? 'border-[var(--destructive)] focus:outline-[var(--destructive)]'
                    : 'border-[var(--input-border)] focus:outline-[var(--input-focus-ring)]',
                ].join(' ')}
                rows={4}
                placeholder="例: 駐車場の利用は可能ですか？（1〜500文字）"
                value={content}
                onChange={(e) => {
                  setContent(e.target.value)
                  if (e.target.value) setError('')
                }}
                maxLength={500}
              />
              <div className="flex justify-between items-center">
                {error ? (
                  <p className="text-[var(--text-xs)]" style={{ color: 'var(--destructive)' }}>{error}</p>
                ) : (
                  <span />
                )}
                <p className="text-[var(--text-xs)]" style={{ color: 'var(--foreground-muted)' }}>
                  {content.length}/500文字
                </p>
              </div>
            </div>

            <div className="flex gap-[var(--space-3)]">
              <Button variant="default" size="md" loading={loading} className="flex-1">
                <Icon name="message" size={16} />
                送信する
              </Button>
              <Button variant="ghost" size="md">
                キャンセル
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

// ---- Meta ----

const meta: Meta<typeof InquiryToOwnerPage> = {
  title: 'Pages/利用者/オーナーへ問合せ',
  component: InquiryToOwnerPage,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof InquiryToOwnerPage>

// ---- Stories ----

export const Default: Story = {
  args: {
    loading: false,
    submitted: false,
    hasHistory: true,
    inputError: false,
  },
}

export const NoHistory: Story = {
  args: {
    loading: false,
    submitted: false,
    hasHistory: false,
    inputError: false,
  },
}

export const WithValidationError: Story = {
  args: {
    loading: false,
    submitted: false,
    hasHistory: false,
    inputError: true,
  },
}

export const Loading: Story = {
  args: {
    loading: true,
    submitted: false,
    hasHistory: true,
    inputError: false,
  },
}

export const Submitted: Story = {
  args: {
    loading: false,
    submitted: true,
    hasHistory: false,
    inputError: false,
  },
}
