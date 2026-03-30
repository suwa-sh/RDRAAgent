import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React from 'react'
import { OwnerPortalShell } from '@/components/layout/OwnerPortalShell'
import { StatusBadge } from '@/components/domain/StatusBadge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'

const meta: Meta = {
  title: 'Pages/Owner/鍵管理画面',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj

export const LendKey: Story = {
  name: '鍵を貸し出す',
  render: () => (
    <OwnerPortalShell currentPage="keys" breadcrumbs={['鍵管理', '鍵貸出']}>
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-6)' }}>
        鍵を貸し出す
      </h1>
      <div style={{ maxWidth: '32rem' }}>
        <Card>
          <div className="flex items-center justify-between" style={{ marginBottom: 'var(--spacing-4)' }}>
            <div className="flex items-center gap-2">
              <Icon name="key" size={20} />
              <span style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--foreground)' }}>
                コワーキングスペース渋谷A
              </span>
            </div>
            <StatusBadge status="保管中" model="key" />
          </div>
          <div className="flex flex-col gap-2" style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)', marginBottom: 'var(--spacing-4)' }}>
            <div className="flex items-center gap-2">
              <Icon name="user" size={14} />
              <span>利用者: 田中太郎</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="calendar" size={14} />
              <span>2026-04-20 10:00-12:00</span>
            </div>
          </div>
          <Button className="w-full">鍵を貸し出す</Button>
        </Card>
      </div>
    </OwnerPortalShell>
  ),
}

export const ReturnKey: Story = {
  name: '鍵を返却する',
  render: () => (
    <OwnerPortalShell currentPage="keys" breadcrumbs={['鍵管理', '鍵返却']}>
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-6)' }}>
        鍵を返却する
      </h1>
      <div style={{ maxWidth: '32rem' }}>
        <Card>
          <div className="flex items-center justify-between" style={{ marginBottom: 'var(--spacing-4)' }}>
            <div className="flex items-center gap-2">
              <Icon name="key" size={20} />
              <span style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--foreground)' }}>
                コワーキングスペース渋谷A
              </span>
            </div>
            <StatusBadge status="貸出中" model="key" />
          </div>
          <div className="flex flex-col gap-2" style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)', marginBottom: 'var(--spacing-4)' }}>
            <div className="flex items-center gap-2">
              <Icon name="user" size={14} />
              <span>利用者: 田中太郎</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="calendar" size={14} />
              <span>2026-04-20 10:00-12:00</span>
            </div>
          </div>
          <Button className="w-full">鍵の返却を確認する</Button>
        </Card>
      </div>
    </OwnerPortalShell>
  ),
}
