import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React, { useState } from 'react'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { InquiryThread, type Message } from '@/components/domain/InquiryThread'

const meta: Meta = {
  title: 'Pages/管理者/問合せ対応',
  parameters: {
    layout: 'fullscreen',
    globals: { portal: 'admin' },
  },
}

export default meta
type Story = StoryObj

/* ----------------------------------------------------------------
   Mock data
---------------------------------------------------------------- */

type InquiryStatus = 'pending' | 'answered' | 'resolved'

interface Inquiry {
  id: string
  userName: string
  category: string
  subject: string
  receivedAt: string
  status: InquiryStatus
}

const inquiries: Inquiry[] = [
  { id: 'INQ-001', userName: '山田花子',  category: '予約・キャンセル', subject: '予約のキャンセル方法を教えてください',              receivedAt: '2026-03-29 09:12', status: 'pending'  },
  { id: 'INQ-002', userName: '佐々木健太', category: '支払い・請求',   subject: '請求書の発行をお願いしたい',                        receivedAt: '2026-03-29 10:34', status: 'pending'  },
  { id: 'INQ-003', userName: '田中美咲',  category: '会議室・設備',   subject: 'プロジェクターの使い方がわかりません',               receivedAt: '2026-03-28 15:20', status: 'pending'  },
  { id: 'INQ-004', userName: '中村拓也',  category: 'アカウント',     subject: 'パスワードを忘れてしまいました',                     receivedAt: '2026-03-27 11:05', status: 'answered' },
  { id: 'INQ-005', userName: '小林裕子',  category: '予約・キャンセル', subject: '変更後の予約確認メールが届かない',                   receivedAt: '2026-03-26 14:45', status: 'answered' },
  { id: 'INQ-006', userName: '渡辺正雄',  category: '支払い・請求',   subject: 'クレジットカードの変更ができない',                   receivedAt: '2026-03-25 09:30', status: 'resolved' },
]

const mockMessages: Message[] = [
  {
    id: 'msg-1',
    sender: '山田花子',
    senderRole: 'user',
    content: '先日予約した渋谷A会議室の予約をキャンセルしたいのですが、方法を教えていただけますか？予約日は2026年4月5日です。',
    timestamp: '2026-03-29 09:12',
  },
  {
    id: 'msg-2',
    sender: '山田 管理者',
    senderRole: 'admin',
    content: 'お問い合わせいただきありがとうございます。予約のキャンセルは「予約管理」画面から行えます。対象の予約を選択し「予約を取り消す」ボタンをクリックしてください。キャンセルポリシーに基づき手数料が発生する場合があります。',
    timestamp: '2026-03-29 09:45',
  },
]

const statusConfig: Record<InquiryStatus, { label: string; variant: 'warning' | 'info' | 'success' }> = {
  pending:  { label: '未対応',  variant: 'warning' },
  answered: { label: '回答済み', variant: 'info' },
  resolved: { label: '対応済み', variant: 'success' },
}

type TabKey = 'all' | InquiryStatus

const tabs: { key: TabKey; label: string }[] = [
  { key: 'all',      label: '全件' },
  { key: 'pending',  label: '未対応' },
  { key: 'answered', label: '回答済み' },
  { key: 'resolved', label: '対応済み' },
]

/* ----------------------------------------------------------------
   Page component
---------------------------------------------------------------- */

const InquiryManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('pending')
  const [keyword, setKeyword] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [answerText, setAnswerText] = useState('')
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [isSending, setIsSending] = useState(false)
  const [sendSuccess, setSendSuccess] = useState(false)

  const pendingCount = inquiries.filter((i) => i.status === 'pending').length

  const filtered = inquiries
    .filter((i) => activeTab === 'all' || i.status === activeTab)
    .filter(
      (i) =>
        keyword === '' ||
        i.userName.includes(keyword) ||
        i.subject.includes(keyword)
    )

  const selectedInquiry = selectedId ? inquiries.find((i) => i.id === selectedId) : null

  const handleSend = () => {
    if (!answerText.trim()) return
    setIsSending(true)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          sender: '山田 管理者',
          senderRole: 'admin',
          content: answerText,
          timestamp: new Date().toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
        },
      ])
      setAnswerText('')
      setIsSending(false)
      setSendSuccess(true)
      setTimeout(() => setSendSuccess(false), 3000)
    }, 800)
  }

  return (
    <AdminLayout pageTitle="問合せ対応" activeNav="問合せ">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: selectedInquiry ? '420px 1fr' : '1fr',
          gap: 'var(--space-4)',
          alignItems: 'start',
        }}
      >
        {/* Left: inquiry list */}
        <div>
          {/* Tabs */}
          <Card className="mb-[var(--space-3)]">
            <div
              style={{
                display: 'flex',
                gap: 'var(--space-1)',
                borderBottom: '1px solid var(--border)',
                marginBottom: 'var(--space-3)',
                paddingBottom: 'var(--space-1)',
              }}
            >
              {tabs.map((tab) => {
                const isActive = activeTab === tab.key
                return (
                  <button
                    key={tab.key}
                    onClick={() => { setActiveTab(tab.key); setSelectedId(null) }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-2)',
                      padding: 'var(--space-2) var(--space-3)',
                      borderRadius: 'var(--radius-lg)',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 'var(--text-sm)',
                      fontWeight: isActive ? 'var(--font-semibold)' : 'var(--font-normal)',
                      color: isActive ? '#334155' : 'var(--foreground-secondary)',
                      background: isActive ? 'var(--color-gray-100)' : 'transparent',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {tab.label}
                    {tab.key === 'pending' && pendingCount > 0 && (
                      <span
                        style={{
                          minWidth: 20,
                          height: 20,
                          borderRadius: 'var(--radius-full)',
                          background: 'var(--color-red-500)',
                          color: '#FFFFFF',
                          fontSize: 'var(--text-xs)',
                          fontWeight: 'var(--font-bold)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          paddingLeft: 'var(--space-1)',
                          paddingRight: 'var(--space-1)',
                        }}
                      >
                        {pendingCount}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Search */}
            <div style={{ position: 'relative' }}>
              <span
                style={{
                  position: 'absolute',
                  left: 'var(--space-3)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Icon name="search" size={16} />
              </span>
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="問合せ内容・利用者名で検索"
                style={{
                  width: '100%',
                  height: 'var(--input-height)',
                  paddingLeft: 'var(--space-9)',
                  paddingRight: 'var(--input-px)',
                  borderRadius: 'var(--input-radius)',
                  border: '1px solid var(--input-border)',
                  fontSize: 'var(--input-font-size)',
                  background: 'var(--background)',
                  color: 'var(--foreground)',
                }}
              />
            </div>
          </Card>

          {/* List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {filtered.length === 0 ? (
              <Card>
                <p style={{ textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--foreground-muted)', padding: 'var(--space-8) 0' }}>
                  該当する問合せが見つかりません
                </p>
              </Card>
            ) : (
              filtered.map((inq) => {
                const { label, variant } = statusConfig[inq.status]
                const isSelected = selectedId === inq.id
                return (
                  <div
                    key={inq.id}
                    onClick={() => setSelectedId(inq.id)}
                    style={{
                      padding: 'var(--space-4)',
                      background: isSelected ? 'var(--color-gray-100)' : 'var(--background)',
                      border: `1px solid ${isSelected ? '#334155' : 'var(--border)'}`,
                      borderRadius: 'var(--card-radius)',
                      cursor: 'pointer',
                      transition: 'border-color var(--duration-normal), background var(--duration-normal)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <div
                          style={{
                            width: 'var(--avatar-size-sm)',
                            height: 'var(--avatar-size-sm)',
                            borderRadius: 'var(--avatar-radius)',
                            background: '#334155',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 'var(--text-xs)',
                            fontWeight: 'var(--font-semibold)',
                            flexShrink: 0,
                          }}
                        >
                          {inq.userName[0]}
                        </div>
                        <div>
                          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--foreground)' }}>
                            {inq.userName}
                          </span>
                          <span
                            style={{
                              marginLeft: 'var(--space-2)',
                              fontSize: 'var(--text-xs)',
                              color: 'var(--foreground-muted)',
                              background: 'var(--muted)',
                              padding: '1px var(--space-2)',
                              borderRadius: 'var(--radius-sm)',
                            }}
                          >
                            {inq.category}
                          </span>
                        </div>
                      </div>
                      <Badge variant={variant}>{label}</Badge>
                    </div>
                    <p
                      style={{
                        fontSize: 'var(--text-sm)',
                        color: 'var(--foreground)',
                        marginBottom: 'var(--space-2)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {inq.subject}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground-muted)' }}>
                        {inq.receivedAt}
                      </span>
                      {inq.status === 'pending' && (
                        <Button
                          variant="default"
                          size="sm"
                          style={{ background: '#334155' }}
                          onClick={(e) => { e.stopPropagation(); setSelectedId(inq.id) }}
                        >
                          対応
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Right: detail & answer panel */}
        {selectedInquiry && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <button
                onClick={() => setSelectedId(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-1)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--foreground-secondary)',
                  padding: 0,
                }}
              >
                <span style={{ fontSize: 12 }}>←</span>
                一覧に戻る
              </button>
              <span style={{ color: 'var(--border)' }}>|</span>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--foreground)' }}>
                {selectedInquiry.id}
              </span>
              <Badge variant={statusConfig[selectedInquiry.status].variant}>
                {statusConfig[selectedInquiry.status].label}
              </Badge>
            </div>

            {/* Inquiry detail */}
            <Card>
              <h3
                style={{
                  fontSize: 'var(--text-base)',
                  fontWeight: 'var(--font-semibold)',
                  color: 'var(--foreground)',
                  marginBottom: 'var(--space-3)',
                }}
              >
                問合せ詳細
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {[
                  ['利用者名', selectedInquiry.userName],
                  ['カテゴリー', selectedInquiry.category],
                  ['受付日時', selectedInquiry.receivedAt],
                  ['件名', selectedInquiry.subject],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', gap: 'var(--space-4)' }}>
                    <span
                      style={{
                        width: 80,
                        flexShrink: 0,
                        fontSize: 'var(--text-xs)',
                        fontWeight: 'var(--font-medium)',
                        color: 'var(--foreground-secondary)',
                        paddingTop: 2,
                      }}
                    >
                      {label}
                    </span>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>{value}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Thread */}
            <InquiryThread messages={messages} onSend={(text) => {
              setMessages((prev) => [
                ...prev,
                {
                  id: `msg-${Date.now()}`,
                  sender: '山田 管理者',
                  senderRole: 'admin',
                  content: text,
                  timestamp: new Date().toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
                },
              ])
            }} />

            {/* Answer form */}
            <Card>
              <h3
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-semibold)',
                  color: 'var(--foreground)',
                  marginBottom: 'var(--space-3)',
                }}
              >
                回答入力
              </h3>
              {sendSuccess && (
                <div
                  style={{
                    marginBottom: 'var(--space-3)',
                    padding: 'var(--space-3)',
                    borderRadius: 'var(--radius-lg)',
                    background: 'var(--color-green-50)',
                    border: '1px solid var(--color-green-100)',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-green-700)',
                  }}
                >
                  回答を送信しました
                </div>
              )}
              <textarea
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="回答内容を入力してください（1〜2000文字）"
                rows={4}
                maxLength={2000}
                style={{
                  width: '100%',
                  padding: 'var(--input-px)',
                  borderRadius: 'var(--input-radius)',
                  border: '1px solid var(--input-border)',
                  fontSize: 'var(--input-font-size)',
                  background: 'var(--background)',
                  color: 'var(--foreground)',
                  resize: 'vertical',
                  fontFamily: 'var(--font-sans)',
                  marginBottom: 'var(--space-2)',
                }}
              />
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground-muted)' }}>
                  {answerText.length} / 2000文字
                </span>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  {selectedInquiry.status === 'answered' && (
                    <Button variant="secondary" size="sm">
                      対応済みにする
                    </Button>
                  )}
                  <Button
                    variant="default"
                    size="sm"
                    style={{ background: '#334155' }}
                    loading={isSending}
                    disabled={answerText.trim().length === 0}
                    onClick={handleSend}
                  >
                    <Icon name="message" size={14} />
                    回答送信
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export const Default: Story = {
  render: () => <InquiryManagementPage />,
}

export const WithDetail: Story = {
  name: '問合せ詳細表示',
  render: () => {
    // Pre-select first inquiry
    const Page: React.FC = () => {
      const [selectedId, setSelectedId] = useState<string>('INQ-001')
      const [answerText, setAnswerText] = useState('')
      const [msgs, setMsgs] = useState<Message[]>(mockMessages)

      const inq = inquiries.find((i) => i.id === selectedId)!
      const { label, variant } = statusConfig[inq.status]

      return (
        <AdminLayout pageTitle="問合せ対応" activeNav="問合せ">
          <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: 'var(--space-4)', alignItems: 'start' }}>
            {/* simplified list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {inquiries.filter((i) => i.status === 'pending').map((inq) => {
                const { label: l, variant: v } = statusConfig[inq.status]
                return (
                  <div
                    key={inq.id}
                    onClick={() => setSelectedId(inq.id)}
                    style={{
                      padding: 'var(--space-4)',
                      background: selectedId === inq.id ? 'var(--color-gray-100)' : 'var(--background)',
                      border: `1px solid ${selectedId === inq.id ? '#334155' : 'var(--border)'}`,
                      borderRadius: 'var(--card-radius)',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--foreground)' }}>{inq.userName}</span>
                      <Badge variant={v}>{l}</Badge>
                    </div>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inq.subject}</p>
                  </div>
                )
              })}
            </div>

            {/* Detail */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--foreground)' }}>{inq.id}</span>
                <Badge variant={variant}>{label}</Badge>
              </div>
              <InquiryThread messages={msgs} onSend={(text) => {
                setMsgs((prev) => [
                  ...prev,
                  { id: `msg-${Date.now()}`, sender: '山田 管理者', senderRole: 'admin', content: text, timestamp: '2026-03-29 10:00' },
                ])
              }} />
              <Card>
                <textarea
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  placeholder="回答内容を入力してください"
                  rows={3}
                  style={{
                    width: '100%',
                    padding: 'var(--input-px)',
                    borderRadius: 'var(--input-radius)',
                    border: '1px solid var(--input-border)',
                    fontSize: 'var(--input-font-size)',
                    background: 'var(--background)',
                    color: 'var(--foreground)',
                    resize: 'vertical',
                    fontFamily: 'var(--font-sans)',
                    marginBottom: 'var(--space-3)',
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
                  <Button variant="secondary" size="sm">対応済みにする</Button>
                  <Button variant="default" size="sm" style={{ background: '#334155' }} disabled={!answerText.trim()}>
                    <Icon name="message" size={14} />
                    回答送信
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </AdminLayout>
      )
    }
    return <Page />
  },
}
