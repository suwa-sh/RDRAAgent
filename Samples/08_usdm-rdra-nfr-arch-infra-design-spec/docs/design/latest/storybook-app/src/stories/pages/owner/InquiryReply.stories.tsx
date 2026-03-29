import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React from 'react'
import { OwnerLayout } from '@/components/layout/OwnerLayout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { InquiryThread, type Message } from '@/components/domain/InquiryThread'
import { Icon } from '@/components/ui/Icon'

// ---- モックデータ ----

const mockInquiry = {
  id: 'inq-001',
  subject: '設備について確認させてください',
  roomName: '大会議室A（渋谷）',
  status: 'open' as const,
  createdAt: '2026-03-14 10:22',
}

const mockMessages: Message[] = [
  {
    id: 'msg-001',
    sender: '田中太郎',
    senderRole: 'user',
    content: 'はじめまして。3月20日に予約を検討しているのですが、会議室にHDMIケーブルはありますか？ノートPCをプロジェクターに接続したいのですが。',
    timestamp: '2026-03-14 10:22',
  },
  {
    id: 'msg-002',
    sender: '山田 花子（オーナー）',
    senderRole: 'owner',
    content: 'お問い合わせありがとうございます。HDMIケーブルは会議室にご用意しております。また、Type-CからHDMIへの変換アダプターも複数ご用意しておりますのでご安心ください。',
    timestamp: '2026-03-14 11:45',
  },
  {
    id: 'msg-003',
    sender: '田中太郎',
    senderRole: 'user',
    content: 'ありがとうございます。安心しました。あと、駐輪場はありますか？自転車で行く予定です。',
    timestamp: '2026-03-14 12:10',
  },
]

const mockMessagesWithReply: Message[] = [
  ...mockMessages,
  {
    id: 'msg-004',
    sender: '山田 花子（オーナー）',
    senderRole: 'owner',
    content: '駐輪場についてですが、建物1Fに無料の駐輪スペースがございます。台数に限りがありますが、先着順でご利用いただけます。ご来訪お待ちしております。',
    timestamp: '2026-03-14 13:00',
  },
]

// ---- ページコンポーネント ----

interface InquiryReplyPageProps {
  hasNewReply?: boolean
}

const InquiryReplyPage: React.FC<InquiryReplyPageProps> = ({ hasNewReply = false }) => {
  const messages = hasNewReply ? mockMessagesWithReply : mockMessages

  return (
    <OwnerLayout
      breadcrumbs={[
        { label: 'ダッシュボード', href: '/owner' },
        { label: '問合せ', href: '/owner/inquiries' },
        { label: '問合せ回答' },
      ]}
      notificationCount={hasNewReply ? 0 : 1}
    >
      <div style={{ maxWidth: 780, display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {/* ページタイトル */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <div>
            <h1
              style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: 'var(--font-bold)',
                color: 'var(--foreground)',
                margin: 0,
              }}
            >
              問合せ回答
            </h1>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)', marginTop: 'var(--space-1)' }}>
              利用者からの問合せに回答します
            </p>
          </div>
          <Badge variant={hasNewReply ? 'success' : 'warning'}>
            {hasNewReply ? '解決済' : '未回答あり'}
          </Badge>
        </div>

        {/* 問合せ概要 */}
        <Card>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: 'var(--space-2) var(--space-4)',
              fontSize: 'var(--text-sm)',
            }}
          >
            <span style={{ color: 'var(--foreground-secondary)' }}>件名</span>
            <span style={{ fontWeight: 'var(--font-semibold)', color: 'var(--foreground)' }}>{mockInquiry.subject}</span>

            <span style={{ color: 'var(--foreground-secondary)' }}>対象会議室</span>
            <span style={{ color: 'var(--foreground)', display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
              <Icon name="room" size={14} />
              {mockInquiry.roomName}
            </span>

            <span style={{ color: 'var(--foreground-secondary)' }}>問合せID</span>
            <span style={{ fontFamily: 'monospace', color: 'var(--foreground)' }}>{mockInquiry.id}</span>

            <span style={{ color: 'var(--foreground-secondary)' }}>受付日時</span>
            <span style={{ color: 'var(--foreground)' }}>{mockInquiry.createdAt}</span>
          </div>
        </Card>

        {/* スレッド */}
        <InquiryThread
          messages={messages}
          onSend={(msg) => console.log('送信:', msg)}
        />

        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
          <Button variant="outline" size="md">
            問合せを閉じる
          </Button>
        </div>
      </div>
    </OwnerLayout>
  )
}

// ---- Meta ----

const meta: Meta<typeof InquiryReplyPage> = {
  title: 'Pages/オーナー/問合せ回答',
  component: InquiryReplyPage,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof InquiryReplyPage>

export const PendingReply: Story = { args: { hasNewReply: false } }
export const Replied: Story = { args: { hasNewReply: true } }
