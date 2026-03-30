import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React from 'react'
import { OwnerPortalShell } from '@/components/layout/OwnerPortalShell'
import { SummaryCard } from '@/components/domain/SummaryCard'
import { PriceDisplay } from '@/components/domain/PriceDisplay'
import { Card } from '@/components/ui/Card'

const meta: Meta = {
  title: 'Pages/Owner/売上実績確認画面',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => (
    <OwnerPortalShell currentPage="analytics" breadcrumbs={['実績', '売上実績']}>
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-6)' }}>
        売上実績を確認する
      </h1>
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 'var(--spacing-6)' }}>
        <SummaryCard label="今月の売上" value="¥450,000" change={15} trend="up" />
        <SummaryCard label="手数料控除後" value="¥405,000" change={15} trend="up" />
        <SummaryCard label="平均単価" value="¥10,000" change={3} trend="up" />
      </div>
      <Card>
        <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-4)' }}>
          月別売上推移
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--muted)', textAlign: 'left' }}>
                <th style={{ padding: 'var(--spacing-3)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--foreground)' }}>月</th>
                <th style={{ padding: 'var(--spacing-3)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--foreground)' }}>売上</th>
                <th style={{ padding: 'var(--spacing-3)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--foreground)' }}>手数料</th>
                <th style={{ padding: 'var(--spacing-3)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--foreground)' }}>実収入</th>
              </tr>
            </thead>
            <tbody>
              {[
                { month: '2026年3月', revenue: 420000, commission: 42000, net: 378000 },
                { month: '2026年2月', revenue: 380000, commission: 38000, net: 342000 },
                { month: '2026年1月', revenue: 350000, commission: 35000, net: 315000 },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: 'var(--spacing-3)', fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>{row.month}</td>
                  <td style={{ padding: 'var(--spacing-3)' }}><PriceDisplay amount={row.revenue} size="sm" suffix="" /></td>
                  <td style={{ padding: 'var(--spacing-3)' }}><PriceDisplay amount={row.commission} size="sm" suffix="" /></td>
                  <td style={{ padding: 'var(--spacing-3)' }}><PriceDisplay amount={row.net} size="sm" suffix="" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </OwnerPortalShell>
  ),
}
