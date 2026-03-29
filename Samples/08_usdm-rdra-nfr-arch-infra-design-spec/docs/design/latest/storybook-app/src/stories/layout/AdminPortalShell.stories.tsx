import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React from 'react'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

// ---- ダミーコンテンツ ----

const DashboardContent: React.FC = () => (
  <div className="flex flex-col gap-[var(--space-6)]">
    {/* KPI cards */}
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-[var(--space-4)]">
      {[
        { label: '月間売上', value: '¥3,250,000', badge: '前月比 +12%', badgeVariant: 'success' as const },
        { label: '登録オーナー数', value: '142', badge: '審査待ち 5件', badgeVariant: 'warning' as const },
        { label: '会議室数', value: '389', badge: '新規 +8', badgeVariant: 'info' as const },
        { label: '未対応問合せ', value: '7件', badge: '要対応', badgeVariant: 'destructive' as const },
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

    {/* Recent activity */}
    <Card>
      <h2
        className="text-[var(--text-lg)] font-[var(--font-semibold)] mb-[var(--space-4)]"
        style={{ color: 'var(--foreground)' }}
      >
        最近のオーナー申請
      </h2>
      <div className="flex flex-col divide-y" style={{ borderColor: 'var(--border)' }}>
        {[
          { name: '鈴木 一郎', date: '2026-03-28', status: '審査待ち', statusVariant: 'warning' as const },
          { name: '田中 美咲', date: '2026-03-27', status: '審査中', statusVariant: 'info' as const },
          { name: '佐藤 健太', date: '2026-03-25', status: '承認済み', statusVariant: 'success' as const },
        ].map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between py-[var(--space-3)]"
          >
            <div>
              <p
                className="text-[var(--text-sm)] font-[var(--font-medium)]"
                style={{ color: 'var(--foreground)' }}
              >
                {item.name}
              </p>
              <p
                className="text-[var(--text-xs)]"
                style={{ color: 'var(--foreground-muted)' }}
              >
                申請日: {item.date}
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

const meta: Meta<typeof AdminLayout> = {
  title: 'Common/Layout/AdminPortalShell',
  component: AdminLayout,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof AdminLayout>

// ---- Stories ----

export const Default: Story = {
  name: 'Default',
  args: {
    pageTitle: 'ダッシュボード',
    activeNav: '/admin',
    children: <DashboardContent />,
  },
}

export const WithActiveNav: Story = {
  name: 'WithActiveNav — オーナー管理',
  args: {
    pageTitle: 'オーナー管理',
    activeNav: '/admin/owners',
    children: (
      <div className="flex flex-col gap-[var(--space-4)]">
        <h2
          className="text-[var(--text-xl)] font-[var(--font-semibold)]"
          style={{ color: 'var(--foreground)' }}
        >
          オーナー一覧
        </h2>
        <Card>
          <p
            className="text-[var(--text-sm)]"
            style={{ color: 'var(--foreground-secondary)' }}
          >
            登録オーナーが一覧表示されます。
          </p>
        </Card>
      </div>
    ),
  },
}
