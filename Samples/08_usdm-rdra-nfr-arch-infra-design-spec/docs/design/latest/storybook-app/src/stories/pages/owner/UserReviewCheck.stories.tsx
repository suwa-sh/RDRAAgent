import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React from 'react'
import { OwnerLayout } from '@/components/layout/OwnerLayout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StarRating } from '@/components/domain/StarRating'
import { Icon } from '@/components/ui/Icon'

// ---- モックデータ ----

const mockUserReview = {
  id: 'urev-001',
  reviewerName: '田中太郎',
  reviewerSince: '2025-06-15',
  totalReservations: 12,
  avgRating: 4.8,
  roomName: '大会議室A（渋谷）',
  reservationDate: '2026-03-10',
  rating: 5,
  comment: '会議室がとても清潔で使いやすかったです。次回も利用したいと思います。スタッフの方の対応も丁寧でした。',
  postedAt: '2026-03-12 14:30',
}

// ---- ページコンポーネント ----

const UserReviewCheckPage: React.FC = () => {
  return (
    <OwnerLayout
      breadcrumbs={[
        { label: 'ダッシュボード', href: '/owner' },
        { label: '評価', href: '/owner/reviews' },
        { label: '利用者評価確認' },
      ]}
    >
      <div style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
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
            利用者評価確認
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)', marginTop: 'var(--space-1)' }}>
            利用者が投稿した評価の詳細を確認します
          </p>
        </div>

        {/* 評価詳細 */}
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            {/* 評価スコア */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)' }}>
                  {mockUserReview.roomName} / {mockUserReview.reservationDate}
                </span>
                <StarRating value={mockUserReview.rating} size="lg" readOnly />
              </div>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground-muted)' }}>
                投稿日時: {mockUserReview.postedAt}
              </span>
            </div>

            {/* コメント */}
            <div
              style={{
                background: 'var(--info-light)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-4)',
                fontSize: 'var(--text-sm)',
                color: 'var(--foreground)',
                lineHeight: 1.7,
              }}
            >
              {mockUserReview.comment}
            </div>
          </div>
        </Card>

        {/* 利用者情報 */}
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
              利用者情報
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <div
                style={{
                  width: 56,
                  height: 56,
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
                {mockUserReview.reviewerName[0]}
              </div>
              <div>
                <p style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', color: 'var(--foreground)', margin: 0 }}>
                  {mockUserReview.reviewerName}
                </p>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)', marginTop: 2 }}>
                  会員登録: {mockUserReview.reviewerSince}
                </p>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 'var(--space-3)',
              }}
            >
              <div
                style={{
                  background: 'var(--background-secondary)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-3)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-1)',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground-secondary)' }}>総利用回数</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-1)' }}>
                  <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--foreground)' }}>
                    {mockUserReview.totalReservations}
                  </span>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)' }}>回</span>
                </div>
              </div>
              <div
                style={{
                  background: 'var(--background-secondary)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-3)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-1)',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground-secondary)' }}>平均評価</span>
                <StarRating value={mockUserReview.avgRating} size="md" readOnly />
              </div>
            </div>
          </div>
        </Card>

        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
          <Button variant="outline" size="md">
            一覧に戻る
          </Button>
          <Button variant="default" size="md">
            <Icon name="star" size={16} />
            この利用者を評価する
          </Button>
        </div>
      </div>
    </OwnerLayout>
  )
}

// ---- Meta ----

const meta: Meta<typeof UserReviewCheckPage> = {
  title: 'Pages/オーナー/利用者評価確認',
  component: UserReviewCheckPage,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof UserReviewCheckPage>

export const Default: Story = {}
