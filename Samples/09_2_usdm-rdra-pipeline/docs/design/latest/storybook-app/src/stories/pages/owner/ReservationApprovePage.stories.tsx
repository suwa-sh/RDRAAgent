import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React from 'react'
import { OwnerPortalShell } from '@/components/layout/OwnerPortalShell'
import { ReservationCard } from '@/components/domain/ReservationCard'
import { StarRating } from '@/components/domain/StarRating'
import { StatusBadge } from '@/components/domain/StatusBadge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'

const meta: Meta = {
  title: 'Pages/Owner/利用者許諾画面',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => (
    <OwnerPortalShell currentPage="reservations" breadcrumbs={['予約管理', '利用者許諾']}>
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-6)' }}>
        利用者使用許諾する
      </h1>
      <div className="grid gap-6" style={{ maxWidth: '40rem' }}>
        <ReservationCard
          reservationId="RSV-2026-0003"
          roomName="コワーキングスペース渋谷A"
          dateTime="2026-04-20 10:00-12:00"
          status="予約申請中"
          userName="田中太郎"
        />
        <Card>
          <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-3)' }}>
            利用者情報
          </h2>
          <div className="flex flex-col gap-2" style={{ marginBottom: 'var(--spacing-4)' }}>
            <div className="flex items-center gap-2">
              <Icon name="user" size={16} />
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>田中太郎</span>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)' }}>利用者評価:</span>
              <StarRating value={4.3} readonly size={16} />
            </div>
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)' }}>過去の利用回数:</span>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>12回</span>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline">拒否する</Button>
            <Button>許諾する</Button>
          </div>
        </Card>
      </div>
    </OwnerPortalShell>
  ),
}
