import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React from 'react'
import { OwnerPortalShell } from '@/components/layout/OwnerPortalShell'
import { SummaryCard } from '@/components/domain/SummaryCard'
import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'

const meta: Meta = {
  title: 'Pages/Owner/利用実績確認画面',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => (
    <OwnerPortalShell currentPage="analytics" breadcrumbs={['実績', '利用実績']}>
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-6)' }}>
        利用実績を確認する
      </h1>
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 'var(--spacing-6)' }}>
        <SummaryCard label="今月の予約数" value="45件" change={12} trend="up" />
        <SummaryCard label="稼働率" value="78%" change={5} trend="up" />
        <SummaryCard label="平均評価" value="4.3" change={-2} trend="down" />
      </div>
      <Card>
        <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-4)' }}>
          会議室別利用実績
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--muted)', textAlign: 'left' }}>
                <th style={{ padding: 'var(--spacing-3)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--foreground)' }}>会議室名</th>
                <th style={{ padding: 'var(--spacing-3)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--foreground)' }}>予約数</th>
                <th style={{ padding: 'var(--spacing-3)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--foreground)' }}>稼働率</th>
                <th style={{ padding: 'var(--spacing-3)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--foreground)' }}>評価</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'コワーキングスペース渋谷A', bookings: 25, rate: '85%', rating: '4.5' },
                { name: '新宿ミーティングルームB', bookings: 20, rate: '72%', rating: '4.1' },
              ].map((room, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: 'var(--spacing-3)', fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>{room.name}</td>
                  <td style={{ padding: 'var(--spacing-3)', fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>{room.bookings}件</td>
                  <td style={{ padding: 'var(--spacing-3)', fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>{room.rate}</td>
                  <td style={{ padding: 'var(--spacing-3)', fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>{room.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </OwnerPortalShell>
  ),
}
