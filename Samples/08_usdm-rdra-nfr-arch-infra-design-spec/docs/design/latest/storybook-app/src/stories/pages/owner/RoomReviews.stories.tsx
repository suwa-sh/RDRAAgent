import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React, { useState } from 'react'
import { OwnerLayout } from '@/components/layout/OwnerLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { StarRating } from '@/components/domain/StarRating'
import { Icon } from '@/components/ui/Icon'

// ---- モックデータ ----

const mockReviews = [
  {
    id: 'rev-001',
    roomName: '大会議室A（渋谷）',
    reviewerName: '田中太郎',
    rating: 5,
    comment: '広くて清潔感があり、設備も充実していました。Web会議システムの操作も簡単でスタッフの対応も丁寧でした。',
    reservationDate: '2026-03-10',
    postedAt: '2026-03-15',
  },
  {
    id: 'rev-002',
    roomName: '大会議室A（渋谷）',
    reviewerName: '鈴木花子',
    rating: 4,
    comment: '立地がよく使いやすい会議室です。プロジェクターの画質が少し低めでしたが全体的に満足しています。',
    reservationDate: '2026-03-08',
    postedAt: '2026-03-12',
  },
  {
    id: 'rev-003',
    roomName: '小会議室B（新宿）',
    reviewerName: '山田次郎',
    rating: 3,
    comment: 'コンパクトで使いやすいですが、エアコンの音が少し気になりました。価格は適正だと思います。',
    reservationDate: '2026-03-05',
    postedAt: '2026-03-07',
  },
  {
    id: 'rev-004',
    roomName: 'セミナールーム（品川）',
    reviewerName: '佐藤美咲',
    rating: 5,
    comment: '50名規模のセミナーに最適でした。音響設備・マイクも完備されており大変助かりました。また利用したいです。',
    reservationDate: '2026-02-28',
    postedAt: '2026-03-02',
  },
  {
    id: 'rev-005',
    roomName: '大会議室A（渋谷）',
    reviewerName: '伊藤健一',
    rating: 4,
    comment: 'アクセスがよく清潔でした。駐車場がないのが少々不便でしたが、それ以外は問題ありませんでした。',
    reservationDate: '2026-02-20',
    postedAt: '2026-02-24',
  },
]

const roomNames = ['すべて', '大会議室A（渋谷）', '小会議室B（新宿）', 'セミナールーム（品川）']

// ---- ページコンポーネント ----

interface RoomReviewsPageProps {
  noReviews?: boolean
}

const RoomReviewsPage: React.FC<RoomReviewsPageProps> = ({ noReviews = false }) => {
  const [selectedRoom, setSelectedRoom] = useState('すべて')
  const [minRating, setMinRating] = useState(0)

  const reviews = noReviews ? [] : mockReviews
  const filtered = reviews.filter((r) => {
    const roomMatch = selectedRoom === 'すべて' || r.roomName === selectedRoom
    const ratingMatch = r.rating >= minRating
    return roomMatch && ratingMatch
  })

  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0

  return (
    <OwnerLayout
      breadcrumbs={[
        { label: 'ダッシュボード', href: '/owner' },
        { label: '評価', href: '/owner/reviews' },
        { label: '会議室評価一覧' },
      ]}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
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
              会議室評価一覧
            </h1>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)', marginTop: 'var(--space-1)' }}>
              利用者からの評価・コメントを確認できます
            </p>
          </div>
          {!noReviews && (
            <Card className="flex items-center gap-[var(--space-3)]">
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)' }}>平均評価</div>
                <StarRating value={avgRating} count={reviews.length} size="lg" readOnly />
              </div>
            </Card>
          )}
        </div>

        {/* フィルタ */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            {roomNames.map((name) => (
              <button
                key={name}
                onClick={() => setSelectedRoom(name)}
                style={{
                  padding: 'var(--space-1-5) var(--space-3)',
                  borderRadius: 'var(--radius-lg)',
                  border: `1px solid ${selectedRoom === name ? 'var(--primary)' : 'var(--border)'}`,
                  background: selectedRoom === name ? 'var(--primary-light)' : 'var(--background)',
                  color: selectedRoom === name ? 'var(--primary)' : 'var(--foreground-secondary)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: selectedRoom === name ? 'var(--font-semibold)' : 'var(--font-normal)',
                  cursor: 'pointer',
                  transition: 'all var(--duration-fast)',
                  whiteSpace: 'nowrap',
                }}
              >
                {name}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)', whiteSpace: 'nowrap' }}>最低評価:</span>
            {[0, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setMinRating(star)}
                style={{
                  padding: 'var(--space-1) var(--space-2)',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${minRating === star ? 'var(--primary)' : 'var(--border)'}`,
                  background: minRating === star ? 'var(--primary-light)' : 'var(--background)',
                  color: minRating === star ? 'var(--primary)' : 'var(--foreground-secondary)',
                  fontSize: 'var(--text-sm)',
                  cursor: 'pointer',
                  transition: 'all var(--duration-fast)',
                }}
              >
                {star === 0 ? 'すべて' : `${star}以上`}
              </button>
            ))}
          </div>
        </div>

        {/* レビュー件数 */}
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)', margin: 0 }}>
          {filtered.length}件の評価
        </p>

        {/* レビュー一覧 */}
        {filtered.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-4)',
              padding: 'var(--space-16) var(--space-8)',
              background: 'var(--card-bg)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--card-radius)',
            }}
          >
            <Icon name="star" size={48} />
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', color: 'var(--foreground)', margin: 0 }}>
                評価がありません
              </p>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)', marginTop: 'var(--space-1)' }}>
                条件に一致する評価は見つかりませんでした
              </p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {filtered.map((review) => (
              <Card key={review.id}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background: 'var(--primary-light)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 'var(--font-semibold)',
                            color: 'var(--primary)',
                          }}
                        >
                          {review.reviewerName[0]}
                        </div>
                        <span style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-medium)', color: 'var(--foreground)' }}>
                          {review.reviewerName}
                        </span>
                      </div>
                      <Badge variant="default">{review.roomName}</Badge>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 'var(--space-1)' }}>
                      <StarRating value={review.rating} readOnly size="md" />
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground-muted)' }}>
                        利用日: {review.reservationDate} / 投稿: {review.postedAt}
                      </span>
                    </div>
                  </div>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)', lineHeight: 1.7, margin: 0 }}>
                    {review.comment}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </OwnerLayout>
  )
}

// ---- Meta ----

const meta: Meta<typeof RoomReviewsPage> = {
  title: 'Pages/オーナー/会議室評価一覧',
  component: RoomReviewsPage,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof RoomReviewsPage>

export const Default: Story = { args: { noReviews: false } }
export const NoReviews: Story = { args: { noReviews: true } }
