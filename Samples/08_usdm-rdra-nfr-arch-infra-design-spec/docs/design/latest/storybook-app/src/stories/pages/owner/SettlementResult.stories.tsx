import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { OwnerLayout } from '@/components/layout/OwnerLayout'
import { SettlementSummaryCard, type SettlementStatus } from '@/components/domain/SettlementSummaryCard'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Icon } from '@/components/ui/Icon'

/* ------------------------------------------------------------------ */
/* Types                                                                */
/* ------------------------------------------------------------------ */

interface SettlementRecord {
  id: string
  month: string
  status: SettlementStatus
  totalUsageFee: number
  commissionRate: number
  commissionAmount: number
  settlementAmount: number
  paymentDate?: string
}

/* ------------------------------------------------------------------ */
/* Mock data                                                             */
/* ------------------------------------------------------------------ */

const SETTLEMENTS: SettlementRecord[] = [
  {
    id: 'STL-2026-03',
    month: '2026年3月',
    status: 'calculating',
    totalUsageFee: 84000,
    commissionRate: 10,
    commissionAmount: 8400,
    settlementAmount: 75600,
  },
  {
    id: 'STL-2026-02',
    month: '2026年2月',
    status: 'confirmed',
    totalUsageFee: 48000,
    commissionRate: 10,
    commissionAmount: 4800,
    settlementAmount: 43200,
    paymentDate: '2026年3月5日',
  },
  {
    id: 'STL-2026-01',
    month: '2026年1月',
    status: 'paid',
    totalUsageFee: 62000,
    commissionRate: 10,
    commissionAmount: 6200,
    settlementAmount: 55800,
    paymentDate: '2026年2月5日',
  },
  {
    id: 'STL-2025-12',
    month: '2025年12月',
    status: 'paid',
    totalUsageFee: 91000,
    commissionRate: 10,
    commissionAmount: 9100,
    settlementAmount: 81900,
    paymentDate: '2026年1月5日',
  },
  {
    id: 'STL-2025-11',
    month: '2025年11月',
    status: 'failed',
    totalUsageFee: 35000,
    commissionRate: 10,
    commissionAmount: 3500,
    settlementAmount: 31500,
  },
]

type FilterTab = 'all' | 'paid' | 'confirmed' | 'calculating' | 'failed'

const TAB_LABELS: { value: FilterTab; label: string }[] = [
  { value: 'all', label: '全件' },
  { value: 'paid', label: '支払済' },
  { value: 'confirmed', label: '確定済' },
  { value: 'calculating', label: '計算中' },
  { value: 'failed', label: '失敗' },
]

const formatCurrency = (n: number) => `¥${n.toLocaleString()}`

/* ------------------------------------------------------------------ */
/* Inner component                                                       */
/* ------------------------------------------------------------------ */

const SettlementResultPage: React.FC<{ initialTab?: FilterTab }> = ({ initialTab = 'all' }) => {
  const [activeTab, setActiveTab] = useState<FilterTab>(initialTab)

  const filtered =
    activeTab === 'all' ? SETTLEMENTS : SETTLEMENTS.filter((s) => s.status === activeTab)

  const totalPaid = SETTLEMENTS.filter((s) => s.status === 'paid').reduce(
    (sum, s) => sum + s.settlementAmount,
    0
  )

  const PRIMARY = '#0D9488'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Page title */}
      <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--foreground)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon name="credit-card" size={22} />
        精算結果
      </h1>

      {/* Summary stat card */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Icon name="chart" size={18} />
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)' }}>
            累計受取金額（支払済み合計）
          </span>
        </div>
        <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)', color: PRIMARY }}>
          {formatCurrency(totalPaid)}
        </div>
      </Card>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
        {TAB_LABELS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            style={{
              padding: '8px 16px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === tab.value ? `2px solid ${PRIMARY}` : '2px solid transparent',
              color: activeTab === tab.value ? PRIMARY : 'var(--foreground-secondary)',
              fontWeight: activeTab === tab.value ? 'var(--font-semibold)' : 'var(--font-normal)',
              fontSize: 'var(--text-sm)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              marginBottom: -1,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Settlement cards */}
      {filtered.length === 0 ? (
        <Card>
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--foreground-muted)' }}>
            <Icon name="credit-card" size={40} />
            <p style={{ marginTop: 12, fontSize: 'var(--text-sm)' }}>
              該当する精算データがありません
            </p>
          </div>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {filtered.map((settlement) => (
            <div key={settlement.id} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <SettlementSummaryCard
                month={settlement.month}
                status={settlement.status}
                totalUsageFee={settlement.totalUsageFee}
                commissionRate={settlement.commissionRate}
                commissionAmount={settlement.commissionAmount}
                settlementAmount={settlement.settlementAmount}
                paymentDate={settlement.paymentDate}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <a
                  href={`/owner/settlements/${settlement.id}`}
                  style={{ fontSize: 'var(--text-xs)', color: PRIMARY, textDecoration: 'underline' }}
                >
                  詳細を確認する
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Story meta                                                            */
/* ------------------------------------------------------------------ */

const meta: Meta = {
  title: 'Pages/オーナー/精算結果確認',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => {
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-portal', 'owner')
      }
      return (
        <OwnerLayout
          breadcrumbs={[
            { label: 'ダッシュボード', href: '/owner' },
            { label: '精算' },
          ]}
          notificationCount={0}
          userName="山田 花子"
        >
          <Story />
        </OwnerLayout>
      )
    },
  ],
}

export default meta
type Story = StoryObj<typeof meta>

/* ------------------------------------------------------------------ */
/* Stories                                                              */
/* ------------------------------------------------------------------ */

export const AllSettlements: Story = {
  name: '全件表示',
  render: () => <SettlementResultPage initialTab="all" />,
}

export const PaidOnly: Story = {
  name: '支払済みのみ',
  render: () => <SettlementResultPage initialTab="paid" />,
}

export const CalculatingOnly: Story = {
  name: '計算中のみ',
  render: () => <SettlementResultPage initialTab="calculating" />,
}
