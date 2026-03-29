import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React, { useState } from 'react'
import { OwnerLayout } from '@/components/layout/OwnerLayout'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { StarRating } from '@/components/domain/StarRating'
import { Icon } from '@/components/ui/Icon'

// ---- モックデータ ----

const mockUser = {
  name: '田中太郎',
  reservationId: 'res-20260310-001',
  roomName: '大会議室A（渋谷）',
  date: '2026-03-10',
  timeStart: '14:00',
  timeEnd: '17:00',
}

// ---- ページコンポーネント ----

interface UserReviewRegisterPageProps {
  submitted?: boolean
}

const UserReviewRegisterPage: React.FC<UserReviewRegisterPageProps> = ({ submitted = false }) => {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const ratingLabels: Record<number, string> = {
    1: 'とても悪い',
    2: '悪い',
    3: '普通',
    4: '良い',
    5: 'とても良い',
  }

  return (
    <OwnerLayout
      breadcrumbs={[
        { label: 'ダッシュボード', href: '/owner' },
        { label: '評価', href: '/owner/reviews' },
        { label: '利用者評価登録' },
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
            利用者評価登録
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)', marginTop: 'var(--space-1)' }}>
            利用後の利用者を評価します
          </p>
        </div>

        {submitted && (
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
            評価を登録しました
          </div>
        )}

        {/* 利用者・予約情報 */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'var(--primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--font-bold)',
                color: 'var(--primary)',
                flexShrink: 0,
              }}
            >
              {mockUser.name[0]}
            </div>
            <div>
              <p style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--foreground)', margin: 0 }}>
                {mockUser.name}
              </p>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)', marginTop: 2 }}>
                {mockUser.roomName} / {mockUser.date} {mockUser.timeStart}~{mockUser.timeEnd}
              </p>
            </div>
          </div>
        </Card>

        {/* 評価入力 */}
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {/* 星評価 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', alignItems: 'center' }}>
              <label style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--foreground)' }}>
                総合評価
              </label>
              <StarRating
                value={rating}
                readOnly={false}
                size="lg"
                onChange={setRating}
              />
              {rating > 0 && (
                <span
                  style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-medium)',
                    color: 'var(--primary)',
                  }}
                >
                  {ratingLabels[rating]}
                </span>
              )}
              {rating === 0 && (
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-muted)' }}>
                  星をクリックして評価してください
                </span>
              )}
            </div>

            {/* コメント入力 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1-5)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--foreground)' }}>
                コメント
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
                placeholder="利用者の印象・マナーなど自由にお書きください（他の利用者には非公開です）"
                style={{
                  padding: 'var(--input-py) var(--input-px)',
                  borderRadius: 'var(--input-radius)',
                  border: '1px solid var(--input-border)',
                  fontSize: 'var(--input-font-size)',
                  background: 'var(--background)',
                  color: 'var(--foreground)',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  lineHeight: 1.6,
                }}
              />
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground-muted)', margin: 0 }}>
                {comment.length} / 400 文字
              </p>
            </div>

            <div
              style={{
                background: 'var(--info-light)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-3)',
                fontSize: 'var(--text-xs)',
                color: 'var(--color-blue-700)',
              }}
            >
              評価は利用者本人には表示されません。今後の会議室利用の参考情報として管理者が利用します。
            </div>
          </div>
        </Card>

        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
          <Button variant="outline" size="md">キャンセル</Button>
          <Button variant="default" size="md" disabled={rating === 0}>
            <Icon name="star" size={16} />
            評価を登録
          </Button>
        </div>
      </div>
    </OwnerLayout>
  )
}

// ---- Meta ----

const meta: Meta<typeof UserReviewRegisterPage> = {
  title: 'Pages/オーナー/利用者評価登録',
  component: UserReviewRegisterPage,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof UserReviewRegisterPage>

export const Default: Story = { args: { submitted: false } }
export const Submitted: Story = { args: { submitted: true } }
