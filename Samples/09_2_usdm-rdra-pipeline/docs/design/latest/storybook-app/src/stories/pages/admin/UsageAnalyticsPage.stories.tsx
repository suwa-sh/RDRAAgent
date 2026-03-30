import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React from 'react'
import { AdminPortalShell } from '@/components/layout/AdminPortalShell'
import { SummaryCard } from '@/components/domain/SummaryCard'
import { Card } from '@/components/ui/Card'

const meta: Meta = {
  title: 'Pages/Admin/利用状況分析画面',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => (
    <AdminPortalShell currentPage="usage" breadcrumbs={['利用状況分析']}>
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-6)' }}>
        利用状況を分析する
      </h1>
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 'var(--spacing-6)' }}>
        <SummaryCard label="アクティブユーザー" value="1,250" change={8} trend="up" />
        <SummaryCard label="登録会議室数" value="342" change={5} trend="up" />
        <SummaryCard label="月間予約数" value="2,156" change={12} trend="up" />
        <SummaryCard label="平均稼働率" value="72%" change={3} trend="up" />
      </div>
      <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <Card>
          <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-4)' }}>
            エリア別利用状況
          </h2>
          <div className="flex flex-col gap-3">
            {[
              { area: '渋谷区', count: 523, rate: '85%' },
              { area: '新宿区', count: 412, rate: '72%' },
              { area: '港区', count: 389, rate: '68%' },
              { area: '品川区', count: 245, rate: '55%' },
            ].map((row, i) => (
              <div key={i} className="flex items-center justify-between" style={{ padding: 'var(--spacing-2) 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>{row.area}</span>
                <div className="flex gap-4">
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)' }}>{row.count}件</span>
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--foreground)' }}>{row.rate}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-4)' }}>
            時間帯別利用傾向
          </h2>
          <div className="flex flex-col gap-3">
            {[
              { time: '9:00-12:00', count: 856, label: '午前' },
              { time: '12:00-14:00', count: 312, label: '昼' },
              { time: '14:00-18:00', count: 734, label: '午後' },
              { time: '18:00-21:00', count: 254, label: '夕方' },
            ].map((row, i) => (
              <div key={i} className="flex items-center justify-between" style={{ padding: 'var(--spacing-2) 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>{row.time}</span>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)' }}>{row.count}件</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AdminPortalShell>
  ),
}
