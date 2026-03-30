import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React from 'react'
import { OwnerPortalShell } from '@/components/layout/OwnerPortalShell'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'

const meta: Meta = {
  title: 'Pages/Owner/運用ルール設定画面',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => (
    <OwnerPortalShell currentPage="rooms" breadcrumbs={['会議室管理', 'コワーキングスペース渋谷A', '運用ルール']}>
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-6)' }}>
        運用ルールを設定する
      </h1>
      <div style={{ maxWidth: '40rem' }}>
        <Card style={{ marginBottom: 'var(--spacing-4)' }}>
          <div className="flex items-center gap-2" style={{ marginBottom: 'var(--spacing-4)' }}>
            <Icon name="clock" size={18} />
            <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--foreground)' }}>
              利用時間設定
            </h2>
          </div>
          <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <Input label="利用開始時間" type="time" defaultValue="09:00" />
            <Input label="利用終了時間" type="time" defaultValue="21:00" />
          </div>
        </Card>
        <Card style={{ marginBottom: 'var(--spacing-4)' }}>
          <div className="flex items-center gap-2" style={{ marginBottom: 'var(--spacing-4)' }}>
            <Icon name="settings" size={18} />
            <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--foreground)' }}>
              予約ルール
            </h2>
          </div>
          <div className="flex flex-col gap-4">
            <Input label="最小予約時間 (時間)" type="number" defaultValue="1" />
            <Input label="最大予約時間 (時間)" type="number" defaultValue="8" />
            <Input label="キャンセル期限 (日前)" type="number" defaultValue="1" />
          </div>
        </Card>
        <div className="flex justify-end gap-3">
          <Button variant="outline">キャンセル</Button>
          <Button>保存する</Button>
        </div>
      </div>
    </OwnerPortalShell>
  ),
}
