import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React, { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { StarRating } from '@/components/domain/StarRating'

// ---- モックデータ ----

const mockReservation = {
  id: 'rsv-001',
  roomName: '大会議室A（渋谷）',
  ownerName: '山田一郎',
  usageDate: '2026年4月15日',
}

// ---- ページコンポーネント ----

interface OwnerReviewPageProps {
  loading?: boolean
  submitted?: boolean
  skipClicked?: boolean
}

const OwnerReviewPage: React.FC<OwnerReviewPageProps> = ({
  loading = false,
  submitted = false,
  skipClicked = false,
}) => {
  const [score, setScore] = useState(0)
  const [comment, setComment] = useState('')
  const [scoreError, setScoreError] = useState('')

  if (submitted) {
    return (
      <div style={{ maxWidth: 1280 }} className="mx-auto px-[var(--space-6)] py-[var(--space-8)]">
        <Card className="text-center py-[var(--space-12)]">
          <Icon name="star" size={48} className="mx-auto mb-[var(--space-4)]" />
          <h2 className="text-[var(--text-xl)] font-[var(--font-semibold)] mb-[var(--space-2)]" style={{ color: 'var(--foreground)' }}>
            オーナー評価を投稿しました
          </h2>
          <p className="text-[var(--text-sm)] mb-[var(--space-6)]" style={{ color: 'var(--foreground-secondary)' }}>
            ご評価ありがとうございます。
          </p>
          <Button variant="outline">マイページへ</Button>
        </Card>
      </div>
    )
  }

  if (skipClicked) {
    return (
      <div style={{ maxWidth: 1280 }} className="mx-auto px-[var(--space-6)] py-[var(--space-8)]">
        <Card className="text-center py-[var(--space-12)]">
          <p className="text-[var(--text-sm)] mb-[var(--space-6)]" style={{ color: 'var(--foreground-secondary)' }}>
            評価をスキップしました。
          </p>
          <Button variant="outline">マイページへ</Button>
        </Card>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1280 }} className="mx-auto px-[var(--space-6)] py-[var(--space-8)]">
      <div className="flex flex-col gap-[var(--space-6)]" style={{ maxWidth: 560 }}>
        {/* ページタイトル */}
        <h1 className="text-[var(--text-2xl)] font-[var(--font-bold)]" style={{ color: 'var(--foreground)' }}>
          オーナーを評価する
        </h1>

        {/* オーナー情報 */}
        <Card>
          <div className="flex items-center gap-[var(--space-4)]">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-[var(--text-2xl)] font-[var(--font-bold)]"
              style={{ background: 'var(--muted)', color: 'var(--foreground)' }}
            >
              {mockReservation.ownerName[0]}
            </div>
            <div>
              <div className="flex items-center gap-[var(--space-2)] mb-[var(--space-1)]">
                <p className="text-[var(--text-lg)] font-[var(--font-semibold)]" style={{ color: 'var(--foreground)' }}>
                  {mockReservation.ownerName}
                </p>
                <Icon name="shield-check" size={16} />
              </div>
              <p className="text-[var(--text-sm)]" style={{ color: 'var(--foreground-secondary)' }}>
                {mockReservation.roomName}
              </p>
              <p className="text-[var(--text-xs)]" style={{ color: 'var(--foreground-muted)' }}>
                利用日: {mockReservation.usageDate}
              </p>
            </div>
          </div>
        </Card>

        {/* 評価フォーム */}
        <Card>
          <div className="flex flex-col gap-[var(--space-6)]">
            {/* スター評価 */}
            <div>
              <p className="text-[var(--text-sm)] font-[var(--font-medium)] mb-[var(--space-3)]" style={{ color: 'var(--foreground)' }}>
                総合評価
                <span className="ml-[var(--space-1)]" style={{ color: 'var(--destructive)' }}>*</span>
              </p>
              <div className="flex justify-center py-[var(--space-4)]">
                <StarRating
                  value={score}
                  readOnly={false}
                  size="lg"
                  onChange={(v) => {
                    setScore(v)
                    setScoreError('')
                  }}
                />
              </div>
              {score > 0 && (
                <p className="text-center text-[var(--text-sm)] mt-[var(--space-2)]" style={{ color: 'var(--foreground-secondary)' }}>
                  {score === 1 && 'とても不満'}
                  {score === 2 && '不満'}
                  {score === 3 && '普通'}
                  {score === 4 && '満足'}
                  {score === 5 && 'とても満足'}
                </p>
              )}
              {scoreError && (
                <p className="text-center text-[var(--text-xs)] mt-[var(--space-1)]" style={{ color: 'var(--destructive)' }}>
                  {scoreError}
                </p>
              )}
            </div>

            {/* コメント入力 */}
            <div className="flex flex-col gap-[var(--space-1-5)]">
              <label className="text-[var(--text-sm)] font-[var(--font-medium)]" style={{ color: 'var(--foreground)' }}>
                コメント（任意）
              </label>
              <textarea
                className={[
                  'w-full px-[var(--input-px)] py-[var(--input-py)] rounded-[var(--input-radius)]',
                  'border text-[var(--input-font-size)]',
                  'bg-[var(--background)] text-[color:var(--foreground)]',
                  'placeholder:text-[color:var(--foreground-muted)]',
                  'border-[var(--input-border)] focus:outline-2 focus:outline-[var(--input-focus-ring)] resize-none',
                ].join(' ')}
                rows={4}
                placeholder="オーナーへの評価コメントを入力してください（最大500文字）"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={500}
              />
              <p className="text-right text-[var(--text-xs)]" style={{ color: 'var(--foreground-muted)' }}>
                {comment.length}/500文字
              </p>
            </div>

            {/* ボタン */}
            <div className="flex flex-col gap-[var(--space-3)]">
              <Button
                variant="default"
                size="lg"
                loading={loading}
                className="w-full"
                onClick={() => {
                  if (score === 0) setScoreError('評価を選択してください')
                }}
              >
                投稿する
              </Button>
              <Button variant="ghost" size="md" className="w-full">
                スキップ
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

// ---- Meta ----

const meta: Meta<typeof OwnerReviewPage> = {
  title: 'Pages/利用者/オーナー評価',
  component: OwnerReviewPage,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof OwnerReviewPage>

// ---- Stories ----

export const Default: Story = {
  args: {
    loading: false,
    submitted: false,
    skipClicked: false,
  },
}

export const Loading: Story = {
  args: {
    loading: true,
    submitted: false,
    skipClicked: false,
  },
}

export const Submitted: Story = {
  args: {
    loading: false,
    submitted: true,
    skipClicked: false,
  },
}

export const Skipped: Story = {
  args: {
    loading: false,
    submitted: false,
    skipClicked: true,
  },
}
