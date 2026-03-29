import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React from 'react'
import { UserLayout } from '@/components/layout/UserLayout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { StarRating } from '@/components/domain/StarRating'

// ---- ページコンポーネント ----

type ReviewState = 'input' | 'submitted' | 'error'

interface RoomReviewPageProps {
  state?: ReviewState
  isSubmitting?: boolean
}

const RoomReviewPage: React.FC<RoomReviewPageProps> = ({
  state = 'input',
  isSubmitting = false,
}) => {
  const [score, setScore] = React.useState<number>(state === 'submitted' ? 4 : 0)
  const [comment, setComment] = React.useState(
    state === 'submitted' ? '設備が充実しており、快適に使えました。スタッフの対応も丁寧でまた利用したいです。' : ''
  )
  const [validationError, setValidationError] = React.useState(
    state === 'error' ? '評価スコアを選択してください' : ''
  )

  const handleSubmit = () => {
    if (score === 0) {
      setValidationError('評価スコアを選択してください')
      return
    }
    setValidationError('')
  }

  const maxCommentLength = 500

  if (state === 'submitted') {
    return (
      <UserLayout currentPage="reservations">
        <div className="flex flex-col items-center justify-center gap-[var(--space-6)] py-[var(--space-16)]">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: 'var(--rating-star-color, var(--color-amber-50))', opacity: 1 }}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="var(--rating-star-color)"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <div className="text-center">
            <h1
              className="text-[var(--text-2xl)] font-[var(--font-bold)]"
              style={{ color: 'var(--foreground)' }}
            >
              評価を投稿しました
            </h1>
            <p className="text-[var(--text-base)] mt-[var(--space-2)]" style={{ color: 'var(--foreground-secondary)' }}>
              ご評価ありがとうございます
            </p>
          </div>
          <Card className="w-full max-w-md">
            <div className="flex flex-col gap-[var(--space-4)]">
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-sm)]" style={{ color: 'var(--foreground-muted)' }}>会議室</span>
                <span className="text-[var(--text-sm)] font-[var(--font-semibold)]" style={{ color: 'var(--foreground)' }}>
                  大会議室A（渋谷）
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-sm)]" style={{ color: 'var(--foreground-muted)' }}>評価スコア</span>
                <StarRating value={score} size="md" />
              </div>
              <div>
                <p className="text-[var(--text-xs)] mb-[var(--space-1)]" style={{ color: 'var(--foreground-muted)' }}>コメント</p>
                <p className="text-[var(--text-sm)] leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>
                  {comment}
                </p>
              </div>
            </div>
          </Card>
          <div className="flex flex-col sm:flex-row gap-[var(--space-3)]">
            <Button variant="outline" size="md">
              予約一覧に戻る
            </Button>
            <Button size="md">
              <Icon name="user" size={16} />
              オーナーを評価する
            </Button>
          </div>
        </div>
      </UserLayout>
    )
  }

  return (
    <UserLayout currentPage="reservations">
      <div className="max-w-xl mx-auto flex flex-col gap-[var(--space-6)]">
        {/* パンくずリスト */}
        <nav className="flex items-center gap-[var(--space-2)] text-[var(--text-sm)]" aria-label="パンくずリスト">
          <a href="#" style={{ color: 'var(--primary)' }}>予約一覧</a>
          <span style={{ color: 'var(--foreground-muted)' }}>/</span>
          <span style={{ color: 'var(--foreground-secondary)' }}>会議室を評価する</span>
        </nav>

        {/* ページタイトル */}
        <div>
          <h1
            className="text-[var(--text-2xl)] font-[var(--font-bold)]"
            style={{ color: 'var(--foreground)' }}
          >
            会議室を評価する
          </h1>
          <p className="text-[var(--text-sm)] mt-[var(--space-1)]" style={{ color: 'var(--foreground-secondary)' }}>
            ご利用いただいた会議室の評価をお聞かせください
          </p>
        </div>

        {/* 評価対象会議室情報 */}
        <Card>
          <div className="flex items-start gap-[var(--space-4)]">
            <div
              className="w-16 h-16 rounded-[var(--radius-lg)] flex items-center justify-center shrink-0"
              style={{ background: 'var(--muted)' }}
            >
              <Icon name="room" size={32} />
            </div>
            <div className="flex flex-col gap-[var(--space-1)]">
              <p className="text-[var(--text-lg)] font-[var(--font-semibold)]" style={{ color: 'var(--foreground)' }}>
                大会議室A（渋谷）
              </p>
              <div className="flex items-center gap-[var(--space-1)] text-[var(--text-sm)]" style={{ color: 'var(--foreground-secondary)' }}>
                <Icon name="map-pin" size={14} />
                東京都渋谷区桜丘町1-2 3F
              </div>
              <div className="flex items-center gap-[var(--space-1)] text-[var(--text-sm)]" style={{ color: 'var(--foreground-secondary)' }}>
                <Icon name="calendar" size={14} />
                2026年3月15日（日）10:00 〜 12:00
              </div>
            </div>
          </div>
        </Card>

        {/* 評価フォーム */}
        <Card>
          <div className="flex flex-col gap-[var(--space-6)]">
            {/* スター評価 */}
            <div className="flex flex-col gap-[var(--space-3)]">
              <label className="text-[var(--text-base)] font-[var(--font-semibold)]" style={{ color: 'var(--foreground)' }}>
                評価スコア
                <span className="ml-[var(--space-1)] text-[var(--text-xs)]" style={{ color: 'var(--destructive)' }}>
                  ※必須
                </span>
              </label>
              <div className="flex items-center gap-[var(--space-4)]">
                <StarRating
                  value={score}
                  readOnly={false}
                  size="lg"
                  onChange={setScore}
                />
                {score > 0 && (
                  <span
                    className="text-[var(--text-sm)] font-[var(--font-medium)]"
                    style={{ color: 'var(--foreground-secondary)' }}
                  >
                    {{ 1: 'とても悪い', 2: '悪い', 3: '普通', 4: '良い', 5: 'とても良い' }[score]}
                  </span>
                )}
              </div>
              {validationError && (
                <p className="text-[var(--text-xs)]" style={{ color: 'var(--destructive)' }}>
                  {validationError}
                </p>
              )}
            </div>

            {/* コメント入力 */}
            <div className="flex flex-col gap-[var(--space-2)]">
              <label
                htmlFor="review-comment"
                className="text-[var(--text-base)] font-[var(--font-semibold)]"
                style={{ color: 'var(--foreground)' }}
              >
                コメント
                <span className="ml-[var(--space-1)] text-[var(--text-xs)]" style={{ color: 'var(--foreground-muted)' }}>
                  （任意）
                </span>
              </label>
              <textarea
                id="review-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value.slice(0, maxCommentLength))}
                rows={5}
                placeholder="会議室の良かった点や改善してほしい点をご記入ください"
                className="w-full px-[var(--input-px)] py-[var(--input-py)] rounded-[var(--input-radius)] border text-[var(--input-font-size)] resize-y leading-relaxed"
                style={{
                  borderColor: 'var(--input-border)',
                  background: 'var(--background)',
                  color: 'var(--foreground)',
                  outline: 'none',
                  minHeight: '120px',
                }}
              />
              <p
                className="text-[var(--text-xs)] text-right"
                style={{ color: comment.length >= maxCommentLength * 0.9 ? 'var(--destructive)' : 'var(--foreground-muted)' }}
              >
                {comment.length} / {maxCommentLength}文字
              </p>
            </div>

            {/* ボタン */}
            <div className="flex flex-col sm:flex-row gap-[var(--space-3)] pt-[var(--space-2)] border-t" style={{ borderColor: 'var(--border)' }}>
              <Button
                size="lg"
                className="flex-1"
                disabled={isSubmitting}
                loading={isSubmitting}
                onClick={handleSubmit}
              >
                投稿する
              </Button>
              <Button variant="ghost" size="lg" className="flex-1">
                スキップ
              </Button>
            </div>
          </div>
        </Card>

        {/* プログレス表示 */}
        <div
          className="flex items-center justify-center gap-[var(--space-2)] text-[var(--text-xs)] py-[var(--space-3)] rounded-[var(--radius-lg)]"
          style={{ background: 'var(--background-secondary)', color: 'var(--foreground-muted)' }}
        >
          <Icon name="star" size={14} />
          ステップ 1/2: 会議室を評価する
          <span style={{ color: 'var(--foreground-muted)' }}>→ 次はオーナーを評価する</span>
        </div>
      </div>
    </UserLayout>
  )
}

// ---- Meta ----

const meta: Meta<typeof RoomReviewPage> = {
  title: 'Pages/利用者/会議室評価',
  component: RoomReviewPage,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof RoomReviewPage>

// ---- Stories ----

export const Default: Story = {
  args: {
    state: 'input',
    isSubmitting: false,
  },
}

export const ValidationError: Story = {
  args: {
    state: 'error',
    isSubmitting: false,
  },
}

export const Submitting: Story = {
  args: {
    state: 'input',
    isSubmitting: true,
  },
}

export const Submitted: Story = {
  args: {
    state: 'submitted',
    isSubmitting: false,
  },
}
