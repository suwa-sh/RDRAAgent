import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React, { useState } from 'react'
import { OwnerLayout } from '@/components/layout/OwnerLayout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StarRating } from '@/components/domain/StarRating'
import { Icon } from '@/components/ui/Icon'

// ---- モックデータ ----

const mockUserReviews = [
  {
    id: 'urev-001',
    userName: '田中太郎',
    roomName: '大会議室A（渋谷）',
    reservationDate: '2026-03-10',
    rating: 5,
    comment: '会議室がとても清潔で使いやすかったです。次回も利用したいと思います。',
    postedAt: '2026-03-12',
    ownerEvaluation: 5,
  },
  {
    id: 'urev-002',
    userName: '鈴木一郎',
    roomName: '小会議室B（新宿）',
    reservationDate: '2026-03-08',
    rating: 4,
    comment: '設備が充実していて使いやすかったです。スタッフの方も丁寧でした。',
    postedAt: '2026-03-09',
    ownerEvaluation: 4,
  },
  {
    id: 'urev-003',
    userName: '山田花子',
    roomName: '大会議室A（渋谷）',
    reservationDate: '2026-03-05',
    rating: 3,
    comment: '普通に使えましたが、冷暖房の調節がしにくかったです。',
    postedAt: '2026-03-07',
    ownerEvaluation: null,
  },
  {
    id: 'urev-004',
    userName: '伊藤誠',
    roomName: 'セミナールーム（品川）',
    reservationDate: '2026-02-28',
    rating: 5,
    comment: '大変使いやすい環境でした。また利用します。',
    postedAt: '2026-03-01',
    ownerEvaluation: 5,
  },
  {
    id: 'urev-005',
    userName: '佐藤美咲',
    roomName: 'バーチャル会議室 Premium',
    reservationDate: '2026-02-20',
    rating: 4,
    comment: 'オンライン会議に最適でした。接続も安定していて問題ありませんでした。',
    postedAt: '2026-02-22',
    ownerEvaluation: null,
  },
]

// ---- ページコンポーネント ----

interface UserReviewListPageProps {
  noReviews?: boolean
}

const UserReviewListPage: React.FC<UserReviewListPageProps> = ({ noReviews = false }) => {
  const [filterEvaluated, setFilterEvaluated] = useState<'all' | 'evaluated' | 'not-evaluated'>('all')

  const reviews = noReviews ? [] : mockUserReviews
  const filtered = reviews.filter((r) => {
    if (filterEvaluated === 'evaluated') return r.ownerEvaluation !== null
    if (filterEvaluated === 'not-evaluated') return r.ownerEvaluation === null
    return true
  })

  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0

  return (
    <OwnerLayout
      breadcrumbs={[
        { label: 'ダッシュボード', href: '/owner' },
        { label: '評価', href: '/owner/reviews' },
        { label: '利用者評価一覧' },
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
              利用者評価一覧
            </h1>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)', marginTop: 'var(--space-1)' }}>
              利用者に対するオーナー評価の状況を管理します
            </p>
          </div>
          {!noReviews && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <StarRating value={avgRating} count={reviews.length} size="md" readOnly />
            </div>
          )}
        </div>

        {/* フィルタ */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          {[
            { value: 'all', label: 'すべて' },
            { value: 'evaluated', label: '評価済' },
            { value: 'not-evaluated', label: '未評価' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilterEvaluated(opt.value as typeof filterEvaluated)}
              style={{
                padding: 'var(--space-1-5) var(--space-3)',
                borderRadius: 'var(--radius-lg)',
                border: `1px solid ${filterEvaluated === opt.value ? 'var(--primary)' : 'var(--border)'}`,
                background: filterEvaluated === opt.value ? 'var(--primary-light)' : 'var(--background)',
                color: filterEvaluated === opt.value ? 'var(--primary)' : 'var(--foreground-secondary)',
                fontSize: 'var(--text-sm)',
                fontWeight: filterEvaluated === opt.value ? 'var(--font-semibold)' : 'var(--font-normal)',
                cursor: 'pointer',
                transition: 'all var(--duration-fast)',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* テーブル */}
        {noReviews || filtered.length === 0 ? (
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
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--foreground-secondary)', margin: 0 }}>
              {noReviews ? '評価はまだありません' : '条件に一致する評価はありません'}
            </p>
          </div>
        ) : (
          <Card>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)' }}>
                    <th style={{ textAlign: 'left', padding: 'var(--space-2) var(--space-3)', color: 'var(--foreground-secondary)', fontWeight: 'var(--font-medium)' }}>
                      利用者
                    </th>
                    <th style={{ textAlign: 'left', padding: 'var(--space-2) var(--space-3)', color: 'var(--foreground-secondary)', fontWeight: 'var(--font-medium)' }}>
                      会議室 / 利用日
                    </th>
                    <th style={{ textAlign: 'center', padding: 'var(--space-2) var(--space-3)', color: 'var(--foreground-secondary)', fontWeight: 'var(--font-medium)' }}>
                      利用者評価
                    </th>
                    <th style={{ textAlign: 'center', padding: 'var(--space-2) var(--space-3)', color: 'var(--foreground-secondary)', fontWeight: 'var(--font-medium)' }}>
                      オーナー評価
                    </th>
                    <th style={{ textAlign: 'center', padding: 'var(--space-2) var(--space-3)', color: 'var(--foreground-secondary)', fontWeight: 'var(--font-medium)' }}>
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((review) => (
                    <tr key={review.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: 'var(--space-3)' }}>
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
                              flexShrink: 0,
                            }}
                          >
                            {review.userName[0]}
                          </div>
                          <span style={{ color: 'var(--foreground)' }}>{review.userName}</span>
                        </div>
                      </td>
                      <td style={{ padding: 'var(--space-3)' }}>
                        <div style={{ color: 'var(--foreground)' }}>{review.roomName}</div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground-muted)', marginTop: 2 }}>{review.reservationDate}</div>
                      </td>
                      <td style={{ padding: 'var(--space-3)', textAlign: 'center' }}>
                        <StarRating value={review.rating} readOnly size="sm" />
                      </td>
                      <td style={{ padding: 'var(--space-3)', textAlign: 'center' }}>
                        {review.ownerEvaluation !== null ? (
                          <StarRating value={review.ownerEvaluation} readOnly size="sm" />
                        ) : (
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground-muted)' }}>未評価</span>
                        )}
                      </td>
                      <td style={{ padding: 'var(--space-3)', textAlign: 'center' }}>
                        <Button variant={review.ownerEvaluation !== null ? 'ghost' : 'default'} size="sm">
                          {review.ownerEvaluation !== null ? '編集' : '評価する'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </OwnerLayout>
  )
}

// ---- Meta ----

const meta: Meta<typeof UserReviewListPage> = {
  title: 'Pages/オーナー/利用者評価一覧',
  component: UserReviewListPage,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof UserReviewListPage>

export const Default: Story = { args: { noReviews: false } }
export const NoReviews: Story = { args: { noReviews: true } }
