import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React from 'react'
import { AdminPortalShell } from '@/components/layout/AdminPortalShell'
import { PriceDisplay } from '@/components/domain/PriceDisplay'
import { StatusBadge } from '@/components/domain/StatusBadge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'

const meta: Meta = {
  title: 'Pages/Admin/精算実行画面',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj

const pendingSettlements = [
  { id: 'STL-2026-04-001', owner: '山田太郎', amount: 405000, rooms: 2 },
  { id: 'STL-2026-04-002', owner: '鈴木一郎', amount: 280000, rooms: 1 },
  { id: 'STL-2026-04-003', owner: '高橋花子', amount: 150000, rooms: 3 },
]

export const Default: Story = {
  render: () => (
    <AdminPortalShell currentPage="settlements" breadcrumbs={['精算実行']}>
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-6)' }}>
        オーナー精算を実行する
      </h1>
      <Card style={{ marginBottom: 'var(--spacing-4)' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 'var(--spacing-4)' }}>
          <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--foreground)' }}>
            未精算一覧 (2026年4月)
          </h2>
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)' }}>
            合計: <PriceDisplay amount={835000} size="sm" suffix="" />
          </span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--muted)', textAlign: 'left' }}>
                <th style={{ padding: 'var(--spacing-3)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--foreground)' }}>精算ID</th>
                <th style={{ padding: 'var(--spacing-3)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--foreground)' }}>オーナー</th>
                <th style={{ padding: 'var(--spacing-3)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--foreground)' }}>会議室数</th>
                <th style={{ padding: 'var(--spacing-3)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--foreground)' }}>精算金額</th>
                <th style={{ padding: 'var(--spacing-3)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--foreground)' }}>状態</th>
              </tr>
            </thead>
            <tbody>
              {pendingSettlements.map((row) => (
                <tr key={row.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: 'var(--spacing-3)', fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>{row.id}</td>
                  <td style={{ padding: 'var(--spacing-3)', fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>{row.owner}</td>
                  <td style={{ padding: 'var(--spacing-3)', fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>{row.rooms}件</td>
                  <td style={{ padding: 'var(--spacing-3)' }}><PriceDisplay amount={row.amount} size="sm" suffix="" /></td>
                  <td style={{ padding: 'var(--spacing-3)' }}><StatusBadge status="貸出中" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <div className="flex justify-end gap-3">
        <Button variant="outline">
          <Icon name="check" size={16} />
          明細を確認する
        </Button>
        <Button>
          <Icon name="credit-card" size={16} />
          一括精算を実行する
        </Button>
      </div>
    </AdminPortalShell>
  ),
}
