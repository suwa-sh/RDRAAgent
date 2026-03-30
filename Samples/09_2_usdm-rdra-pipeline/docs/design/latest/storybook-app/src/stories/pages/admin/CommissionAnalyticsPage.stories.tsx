import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React from 'react'
import { AdminPortalShell } from '@/components/layout/AdminPortalShell'
import { SummaryCard } from '@/components/domain/SummaryCard'
import { PriceDisplay } from '@/components/domain/PriceDisplay'
import { Card } from '@/components/ui/Card'

const meta: Meta = {
  title: 'Pages/Admin/手数料売上分析画面',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => (
    <AdminPortalShell currentPage="commission" breadcrumbs={['手数料分析']}>
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-6)' }}>
        手数料売上を分析する
      </h1>
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 'var(--spacing-6)' }}>
        <SummaryCard label="今月の手数料収入" value="¥1,250,000" change={8} trend="up" />
        <SummaryCard label="取引件数" value="523件" change={12} trend="up" />
        <SummaryCard label="平均手数料単価" value="¥2,390" change={-3} trend="down" />
      </div>
      <Card>
        <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-4)' }}>
          月別手数料推移
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--muted)', textAlign: 'left' }}>
                <th style={{ padding: 'var(--spacing-3)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--foreground)' }}>月</th>
                <th style={{ padding: 'var(--spacing-3)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--foreground)' }}>総取引額</th>
                <th style={{ padding: 'var(--spacing-3)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--foreground)' }}>手数料</th>
                <th style={{ padding: 'var(--spacing-3)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--foreground)' }}>件数</th>
              </tr>
            </thead>
            <tbody>
              {[
                { month: '2026年3月', total: 12500000, commission: 1250000, count: 523 },
                { month: '2026年2月', total: 11200000, commission: 1120000, count: 468 },
                { month: '2026年1月', total: 10500000, commission: 1050000, count: 440 },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: 'var(--spacing-3)', fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>{row.month}</td>
                  <td style={{ padding: 'var(--spacing-3)' }}><PriceDisplay amount={row.total} size="sm" suffix="" /></td>
                  <td style={{ padding: 'var(--spacing-3)' }}><PriceDisplay amount={row.commission} size="sm" suffix="" /></td>
                  <td style={{ padding: 'var(--spacing-3)', fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>{row.count}件</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AdminPortalShell>
  ),
}
