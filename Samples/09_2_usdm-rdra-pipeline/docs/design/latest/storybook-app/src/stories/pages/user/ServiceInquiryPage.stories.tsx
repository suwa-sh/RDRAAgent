import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React from 'react'
import { UserPortalShell } from '@/components/layout/UserPortalShell'
import { InquiryThread } from '@/components/domain/InquiryThread'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

const meta: Meta = {
  title: 'Pages/User/サービス問合せ画面',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => (
    <UserPortalShell currentPage="inquiries">
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-4)' }}>
        サービス問合せを送信する
      </h1>
      <div style={{ maxWidth: '40rem' }}>
        <Card>
          <div style={{ marginBottom: 'var(--spacing-4)' }}>
            <Input label="件名" placeholder="問合せ内容を簡潔に記載してください" />
          </div>
          <div style={{ marginBottom: 'var(--spacing-4)' }}>
            <Input label="カテゴリ" placeholder="例: アカウント、予約、精算" />
          </div>
          <InquiryThread messages={[]} />
          <div className="flex gap-3" style={{ marginTop: 'var(--spacing-4)', paddingTop: 'var(--spacing-3)', borderTop: '1px solid var(--border)' }}>
            <Input placeholder="メッセージを入力..." className="flex-1" />
            <Button>送信</Button>
          </div>
        </Card>
      </div>
    </UserPortalShell>
  ),
}
