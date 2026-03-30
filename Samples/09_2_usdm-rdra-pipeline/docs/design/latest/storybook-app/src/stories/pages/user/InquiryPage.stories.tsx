import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React from 'react'
import { UserPortalShell } from '@/components/layout/UserPortalShell'
import { InquiryThread } from '@/components/domain/InquiryThread'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

const meta: Meta = {
  title: 'Pages/User/問合せ送信画面',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj

const sampleMessages = [
  { id: '1', sender: '田中太郎', content: '4月15日の予約について、設備の利用方法を確認したいです。プロジェクターの接続方法を教えてください。', timestamp: '2026-04-10 09:30', isOwn: true },
  { id: '2', sender: 'オーナー山田', content: 'プロジェクターはHDMIケーブルで接続できます。ケーブルは会議室内のキャビネットに収納しています。', timestamp: '2026-04-10 10:15', isOwn: false },
]

export const Default: Story = {
  render: () => (
    <UserPortalShell currentPage="inquiries">
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-4)' }}>
        問合せを送信する
      </h1>
      <div style={{ maxWidth: '40rem' }}>
        <Card>
          <InquiryThread messages={sampleMessages} />
          <div className="flex gap-3" style={{ marginTop: 'var(--spacing-4)', paddingTop: 'var(--spacing-3)', borderTop: '1px solid var(--border)' }}>
            <Input placeholder="メッセージを入力..." className="flex-1" />
            <Button>送信</Button>
          </div>
        </Card>
      </div>
    </UserPortalShell>
  ),
}
