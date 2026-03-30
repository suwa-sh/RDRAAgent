import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React from 'react'
import { OwnerPortalShell } from '@/components/layout/OwnerPortalShell'
import { StarRating } from '@/components/domain/StarRating'
import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'

const meta: Meta = {
  title: 'Pages/Owner/会議室評価一覧画面',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj

const reviews = [
  { id: '1', user: '田中太郎', rating: 5, comment: '設備が充実しており、とても快適に利用できました。', date: '2026-04-15' },
  { id: '2', user: '佐藤花子', rating: 4, comment: 'アクセスが良く便利です。Wi-Fiがもう少し速いと嬉しいです。', date: '2026-04-10' },
  { id: '3', user: '鈴木一郎', rating: 3, comment: '価格相応の会議室です。清掃が行き届いていました。', date: '2026-04-05' },
]

export const Default: Story = {
  render: () => (
    <OwnerPortalShell currentPage="reviews" breadcrumbs={['評価', 'コワーキングスペース渋谷A']}>
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-2)' }}>
        会議室評価を確認する
      </h1>
      <div className="flex items-center gap-3" style={{ marginBottom: 'var(--spacing-6)' }}>
        <StarRating value={4.0} readonly size={20} />
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)' }}>
          ({reviews.length}件のレビュー)
        </span>
      </div>
      <div className="flex flex-col gap-4" style={{ maxWidth: '40rem' }}>
        {reviews.map((review) => (
          <Card key={review.id}>
            <div className="flex items-center justify-between" style={{ marginBottom: 'var(--spacing-2)' }}>
              <div className="flex items-center gap-2">
                <Icon name="user" size={16} />
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--foreground)' }}>
                  {review.user}
                </span>
              </div>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground-secondary)' }}>
                {review.date}
              </span>
            </div>
            <StarRating value={review.rating} readonly size={16} />
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)', marginTop: 'var(--spacing-2)' }}>
              {review.comment}
            </p>
          </Card>
        ))}
      </div>
    </OwnerPortalShell>
  ),
}
