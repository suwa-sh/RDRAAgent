import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React from 'react'
import { AdminPortalShell } from '@/components/layout/AdminPortalShell'
import { StatusBadge } from '@/components/domain/StatusBadge'
import { StepTracker } from '@/components/domain/StepTracker'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'

const meta: Meta = {
  title: 'Pages/Admin/オーナー審査画面',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => (
    <AdminPortalShell currentPage="owners" breadcrumbs={['オーナー審査', 'OWN-2026-0001']}>
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-6)' }}>
        オーナー申請を審査する
      </h1>
      <div style={{ maxWidth: '40rem' }}>
        <div style={{ marginBottom: 'var(--spacing-6)' }}>
          <StepTracker steps={['申請受付', '書類確認', '審査完了']} currentStep={1} />
        </div>
        <Card style={{ marginBottom: 'var(--spacing-4)' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 'var(--spacing-4)' }}>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', color: 'var(--foreground)' }}>
              申請者情報
            </h2>
            <StatusBadge status="審査中" model="owner" />
          </div>
          <div className="flex flex-col gap-2" style={{ fontSize: 'var(--text-sm)' }}>
            <div className="flex gap-4">
              <span style={{ color: 'var(--foreground-secondary)', width: '8rem' }}>氏名</span>
              <span style={{ color: 'var(--foreground)' }}>山田太郎</span>
            </div>
            <div className="flex gap-4">
              <span style={{ color: 'var(--foreground-secondary)', width: '8rem' }}>メールアドレス</span>
              <span style={{ color: 'var(--foreground)' }}>taro@example.com</span>
            </div>
            <div className="flex gap-4">
              <span style={{ color: 'var(--foreground-secondary)', width: '8rem' }}>法人名/屋号</span>
              <span style={{ color: 'var(--foreground)' }}>株式会社サンプル</span>
            </div>
            <div className="flex gap-4">
              <span style={{ color: 'var(--foreground-secondary)', width: '8rem' }}>事業所住所</span>
              <span style={{ color: 'var(--foreground)' }}>東京都渋谷区道玄坂1-2-3</span>
            </div>
            <div className="flex gap-4">
              <span style={{ color: 'var(--foreground-secondary)', width: '8rem' }}>申請日</span>
              <span style={{ color: 'var(--foreground)' }}>2026-04-01</span>
            </div>
          </div>
        </Card>
        <div className="flex justify-end gap-3">
          <Button variant="destructive">却下する</Button>
          <Button>承認する</Button>
        </div>
      </div>
    </AdminPortalShell>
  ),
}
