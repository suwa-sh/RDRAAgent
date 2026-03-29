import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React from 'react'
import { OwnerLayout } from '@/components/layout/OwnerLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

// ---- ダミーコンテンツ ----

const DashboardContent: React.FC = () => (
  <div className="flex flex-col gap-[var(--space-6)]">
    {/* KPI */}
    <div className="grid grid-cols-2 xl:grid-cols-3 gap-[var(--space-4)]">
      {[
        { label: '今月の売上', value: '¥428,000', badge: '前月比 +8%', badgeVariant: 'success' as const },
        { label: '今月の予約件数', value: '57件', badge: 'うちバーチャル 12件', badgeVariant: 'virtual' as const },
        { label: '未対応問合せ', value: '3件', badge: '要対応', badgeVariant: 'warning' as const },
      ].map((stat) => (
        <Card key={stat.label} className="flex flex-col gap-[var(--space-2)]">
          <p
            className="text-[var(--text-sm)]"
            style={{ color: 'var(--foreground-secondary)' }}
          >
            {stat.label}
          </p>
          <p
            className="text-[var(--text-2xl)] font-[var(--font-bold)]"
            style={{ color: 'var(--foreground)' }}
          >
            {stat.value}
          </p>
          <Badge variant={stat.badgeVariant}>{stat.badge}</Badge>
        </Card>
      ))}
    </div>

    {/* Recent reservations */}
    <Card>
      <div className="flex items-center justify-between mb-[var(--space-4)]">
        <h2
          className="text-[var(--text-lg)] font-[var(--font-semibold)]"
          style={{ color: 'var(--foreground)' }}
        >
          最近の予約
        </h2>
        <Button variant="outline" size="sm">すべて見る</Button>
      </div>
      <div className="flex flex-col divide-y" style={{ borderColor: 'var(--border)' }}>
        {[
          { room: '大会議室A（渋谷）', user: '田中 太郎', date: '2026-03-30 10:00', status: '確定', statusVariant: 'success' as const },
          { room: '小会議室B（渋谷）', user: '鈴木 花子', date: '2026-03-30 14:00', status: '確定', statusVariant: 'success' as const },
          { room: '大会議室A（渋谷）', user: '佐藤 健', date: '2026-03-31 09:00', status: 'キャンセル待ち', statusVariant: 'warning' as const },
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-[var(--space-3)]"
          >
            <div>
              <p
                className="text-[var(--text-sm)] font-[var(--font-medium)]"
                style={{ color: 'var(--foreground)' }}
              >
                {item.room}
              </p>
              <p
                className="text-[var(--text-xs)]"
                style={{ color: 'var(--foreground-muted)' }}
              >
                {item.user} / {item.date}
              </p>
            </div>
            <Badge variant={item.statusVariant}>{item.status}</Badge>
          </div>
        ))}
      </div>
    </Card>
  </div>
)

// ---- Meta ----

const meta: Meta<typeof OwnerLayout> = {
  title: 'Common/Layout/OwnerPortalShell',
  component: OwnerLayout,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof OwnerLayout>

// ---- Stories ----

export const Default: Story = {
  name: 'Default',
  args: {
    breadcrumbs: [{ label: 'ダッシュボード' }],
    notificationCount: 3,
    userName: '山田 花子',
    children: <DashboardContent />,
  },
}

export const WithActiveNav: Story = {
  name: 'WithActiveNav — 会議室管理',
  args: {
    breadcrumbs: [
      { label: 'ダッシュボード', href: '/owner' },
      { label: '会議室管理' },
    ],
    notificationCount: 0,
    userName: '山田 花子',
    children: (
      <div className="flex flex-col gap-[var(--space-4)]">
        <div className="flex items-center justify-between">
          <h2
            className="text-[var(--text-xl)] font-[var(--font-semibold)]"
            style={{ color: 'var(--foreground)' }}
          >
            会議室一覧
          </h2>
          <Button size="sm">会議室を登録する</Button>
        </div>
        <Card>
          <p
            className="text-[var(--text-sm)]"
            style={{ color: 'var(--foreground-secondary)' }}
          >
            登録済みの会議室が表示されます。
          </p>
        </Card>
      </div>
    ),
  },
}
