import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React from 'react'
import { AdminPortalShell } from '@/components/layout/AdminPortalShell'
import { InquiryThread } from '@/components/domain/InquiryThread'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

const meta: Meta = {
  title: 'Pages/Admin/サービス問合せ対応画面',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj

const messages = [
  { id: '1', sender: '佐藤花子', content: '精算処理が完了しているはずですが、入金が確認できません。確認をお願いします。', timestamp: '2026-04-10 11:00', isOwn: false },
  { id: '2', sender: '運営担当', content: '確認いたします。精算IDをお知らせいただけますか？', timestamp: '2026-04-10 11:30', isOwn: true },
  { id: '3', sender: '佐藤花子', content: 'STL-2026-03 です。3月分の精算になります。', timestamp: '2026-04-10 11:45', isOwn: false },
]

export const Default: Story = {
  render: () => (
    <AdminPortalShell currentPage="inquiries" breadcrumbs={['問合せ対応', 'INQ-S-0001']}>
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-2)' }}>
        サービス問合せに対応する
      </h1>
      <div className="flex items-center gap-2" style={{ marginBottom: 'var(--spacing-6)' }}>
        <Badge variant="warning">対応中</Badge>
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)' }}>カテゴリ: 精算</span>
      </div>
      <div style={{ maxWidth: '40rem' }}>
        <Card>
          <InquiryThread messages={messages} />
          <div className="flex gap-3" style={{ marginTop: 'var(--spacing-4)', paddingTop: 'var(--spacing-3)', borderTop: '1px solid var(--border)' }}>
            <Input placeholder="回答を入力..." className="flex-1" />
            <Button>送信</Button>
          </div>
        </Card>
      </div>
    </AdminPortalShell>
  ),
}
