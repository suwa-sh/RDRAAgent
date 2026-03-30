import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React from 'react'
import { OwnerPortalShell } from '@/components/layout/OwnerPortalShell'
import { PriceDisplay } from '@/components/domain/PriceDisplay'
import { StatusBadge } from '@/components/domain/StatusBadge'
import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'

const meta: Meta = {
  title: 'Pages/Owner/精算確認画面',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj

const settlements = [
  { id: 'STL-2026-03', period: '2026年3月', amount: 378000, status: '精算済' },
  { id: 'STL-2026-02', period: '2026年2月', amount: 342000, status: '精算済' },
  { id: 'STL-2026-04', period: '2026年4月', amount: 405000, status: '未精算' },
]

export const Default: Story = {
  render: () => (
    <OwnerPortalShell currentPage="settlements" breadcrumbs={['精算', '精算内容確認']}>
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-6)' }}>
        精算内容を確認する
      </h1>
      <div className="flex flex-col gap-4" style={{ maxWidth: '40rem' }}>
        {settlements.map((s) => (
          <Card key={s.id}>
            <div className="flex items-center justify-between" style={{ marginBottom: 'var(--spacing-3)' }}>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground-secondary)' }}>{s.id}</div>
                <div style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--foreground)' }}>{s.period}</div>
              </div>
              <StatusBadge status={s.status === '精算済' ? '返却済' : '貸出中'} model="key" />
            </div>
            <div className="flex items-center justify-between">
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)' }}>精算金額</span>
              <PriceDisplay amount={s.amount} size="md" suffix="" />
            </div>
          </Card>
        ))}
      </div>
    </OwnerPortalShell>
  ),
}
