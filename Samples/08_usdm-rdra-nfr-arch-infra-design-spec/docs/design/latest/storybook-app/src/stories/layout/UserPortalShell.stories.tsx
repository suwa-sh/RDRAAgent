import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React from 'react'
import { UserLayout } from '@/components/layout/UserLayout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

// ---- ダミーコンテンツ ----

const DummyContent: React.FC = () => (
  <div className="flex flex-col gap-[var(--space-6)]">
    <div>
      <h1
        className="text-[var(--text-2xl)] font-[var(--font-bold)]"
        style={{ color: 'var(--foreground)' }}
      >
        会議室を探す
      </h1>
      <p
        className="text-[var(--text-sm)] mt-[var(--space-1)]"
        style={{ color: 'var(--foreground-secondary)' }}
      >
        条件を指定して最適な会議室を見つけましょう
      </p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-[var(--space-4)]">
      {[
        { name: '大会議室A（渋谷）', location: '東京都渋谷区桜丘町1-2', price: '¥5,000/時間', badge: '物理' as const },
        { name: 'バーチャル会議室 Premium', location: 'Zoom', price: '¥1,500/時間', badge: 'バーチャル' as const },
        { name: '小会議室B（新宿）', location: '東京都新宿区西新宿3-5', price: '¥2,500/時間', badge: '物理' as const },
      ].map((room) => (
        <Card key={room.name} hoverable className="flex flex-col gap-[var(--space-3)]">
          <div
            className="w-full rounded-[var(--radius-md)] flex items-center justify-center"
            style={{ height: 120, background: 'var(--muted)' }}
          >
            <Badge variant={room.badge === 'バーチャル' ? 'virtual' : 'info'}>
              {room.badge}
            </Badge>
          </div>
          <div>
            <p
              className="text-[var(--text-base)] font-[var(--font-semibold)] truncate"
              style={{ color: 'var(--foreground)' }}
            >
              {room.name}
            </p>
            <p
              className="text-[var(--text-sm)] mt-[var(--space-0-5)]"
              style={{ color: 'var(--foreground-secondary)' }}
            >
              {room.location}
            </p>
          </div>
          <div className="flex items-center justify-between mt-[var(--space-1)]">
            <span
              className="text-[var(--text-base)] font-[var(--font-bold)]"
              style={{ color: 'var(--foreground)' }}
            >
              {room.price}
            </span>
            <Button size="sm">予約する</Button>
          </div>
        </Card>
      ))}
    </div>
  </div>
)

// ---- Meta ----

const meta: Meta<typeof UserLayout> = {
  title: 'Common/Layout/UserPortalShell',
  component: UserLayout,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof UserLayout>

// ---- Stories ----

export const Default: Story = {
  name: 'Default',
  args: {
    currentPage: 'search',
    userName: '田中 太郎',
    children: <DummyContent />,
  },
}

export const WithActiveNav: Story = {
  name: 'WithActiveNav — 予約一覧',
  args: {
    currentPage: 'reservations',
    userName: '田中 太郎',
    children: (
      <div className="flex flex-col gap-[var(--space-6)]">
        <h1
          className="text-[var(--text-2xl)] font-[var(--font-bold)]"
          style={{ color: 'var(--foreground)' }}
        >
          予約一覧
        </h1>
        <Card>
          <p
            className="text-[var(--text-sm)]"
            style={{ color: 'var(--foreground-secondary)' }}
          >
            現在の予約はありません。会議室を検索して予約してください。
          </p>
        </Card>
      </div>
    ),
  },
}
