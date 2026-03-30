import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React from 'react'
import { OwnerPortalShell } from '@/components/layout/OwnerPortalShell'
import { InquiryThread } from '@/components/domain/InquiryThread'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

const meta: Meta = {
  title: 'Pages/Owner/問合せ回答画面',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj

const messages = [
  { id: '1', sender: '田中太郎', content: 'プロジェクターの接続方法を教えてください。', timestamp: '2026-04-10 09:30', isOwn: false },
  { id: '2', sender: 'オーナー', content: 'HDMIケーブルで接続できます。キャビネットに収納しています。', timestamp: '2026-04-10 10:15', isOwn: true },
  { id: '3', sender: '田中太郎', content: 'ありがとうございます。当日よろしくお願いします。', timestamp: '2026-04-10 10:30', isOwn: false },
]

export const Default: Story = {
  render: () => (
    <OwnerPortalShell currentPage="inquiries" breadcrumbs={['問合せ', 'INQ-0001']}>
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-6)' }}>
        問合せに回答する
      </h1>
      <div style={{ maxWidth: '40rem' }}>
        <Card>
          <InquiryThread messages={messages} />
          <div className="flex gap-3" style={{ marginTop: 'var(--spacing-4)', paddingTop: 'var(--spacing-3)', borderTop: '1px solid var(--border)' }}>
            <Input placeholder="回答を入力..." className="flex-1" />
            <Button>送信</Button>
          </div>
        </Card>
      </div>
    </OwnerPortalShell>
  ),
}
