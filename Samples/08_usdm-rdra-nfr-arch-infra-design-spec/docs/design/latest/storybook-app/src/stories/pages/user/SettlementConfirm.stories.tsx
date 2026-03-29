import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React, { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { SettlementSummaryCard, type SettlementStatus } from '@/components/domain/SettlementSummaryCard'

// ---- モックデータ ----

const allSettlements = [
  {
    id: 'stl-001',
    month: '2026年3月',
    status: 'paid' as SettlementStatus,
    totalUsageFee: 48000,
    commissionRate: 12.5,
    commissionAmount: 6000,
    settlementAmount: 42000,
    paymentDate: '2026-04-05',
  },
  {
    id: 'stl-002',
    month: '2026年2月',
    status: 'paid' as SettlementStatus,
    totalUsageFee: 36000,
    commissionRate: 12.5,
    commissionAmount: 4500,
    settlementAmount: 31500,
    paymentDate: '2026-03-05',
  },
  {
    id: 'stl-003',
    month: '2026年1月',
    status: 'confirmed' as SettlementStatus,
    totalUsageFee: 60000,
    commissionRate: 12.5,
    commissionAmount: 7500,
    settlementAmount: 52500,
    paymentDate: undefined,
  },
  {
    id: 'stl-004',
    month: '2025年12月',
    status: 'calculating' as SettlementStatus,
    totalUsageFee: 24000,
    commissionRate: 12.5,
    commissionAmount: 3000,
    settlementAmount: 21000,
    paymentDate: undefined,
  },
]

type FilterTab = 'all' | 'paid' | 'confirmed' | 'calculating'

const tabLabels: { value: FilterTab; label: string }[] = [
  { value: 'all', label: '全件' },
  { value: 'paid', label: '支払済み' },
  { value: 'confirmed', label: '確定済み' },
  { value: 'calculating', label: '計算中' },
]

const totalPaidAmount = allSettlements
  .filter((s) => s.status === 'paid')
  .reduce((sum, s) => sum + s.settlementAmount, 0)

// ---- ページコンポーネント ----

interface SettlementConfirmPageProps {
  loading?: boolean
  initialTab?: FilterTab
  filterMonth?: string
}

const SettlementConfirmPage: React.FC<SettlementConfirmPageProps> = ({
  loading = false,
  initialTab = 'all',
  filterMonth = '',
}) => {
  const [activeTab, setActiveTab] = useState<FilterTab>(initialTab)
  const [selectedMonth, setSelectedMonth] = useState(filterMonth)

  const filteredSettlements = allSettlements.filter((s) => {
    const matchTab = activeTab === 'all' || s.status === activeTab
    const matchMonth = selectedMonth === '' || s.month.includes(selectedMonth)
    return matchTab && matchMonth
  })

  if (loading) {
    return (
      <div style={{ maxWidth: 1280 }} className="mx-auto px-[var(--space-6)] py-[var(--space-8)]">
        <div className="flex flex-col gap-[var(--space-6)]">
          <h1 className="text-[var(--text-2xl)] font-[var(--font-bold)]" style={{ color: 'var(--foreground)' }}>
            精算結果
          </h1>
          <div className="flex flex-col gap-[var(--space-4)]">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-32 rounded-[var(--card-radius)] border animate-pulse"
                style={{ borderColor: 'var(--border)', background: 'var(--muted)' }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1280 }} className="mx-auto px-[var(--space-6)] py-[var(--space-8)]">
      <div className="flex flex-col gap-[var(--space-6)]">
        {/* ページタイトル */}
        <div className="flex items-center justify-between">
          <h1 className="text-[var(--text-2xl)] font-[var(--font-bold)]" style={{ color: 'var(--foreground)' }}>
            精算結果
          </h1>
        </div>

        {/* 累計受取金額サマリー */}
        <Card>
          <div className="flex items-center gap-[var(--space-4)]">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'var(--success-light)' }}
            >
              <Icon name="chart" size={24} />
            </div>
            <div>
              <p className="text-[var(--text-sm)]" style={{ color: 'var(--foreground-secondary)' }}>
                累計受取金額（支払済み）
              </p>
              <p className="text-[var(--text-3xl)] font-[var(--font-bold)]" style={{ color: 'var(--foreground)' }}>
                ¥{totalPaidAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        {/* フィルタータブ + 月別フィルタ */}
        <div className="flex flex-col gap-[var(--space-3)] sm:flex-row sm:items-center sm:justify-between">
          {/* タブ */}
          <div className="flex gap-[var(--space-1)] p-[var(--space-1)] rounded-[var(--radius-lg)]" style={{ background: 'var(--muted)' }}>
            {tabLabels.map((tab) => (
              <button
                key={tab.value}
                className={[
                  'h-9 px-[var(--space-4)] rounded-[var(--radius-md)] text-[var(--text-sm)] font-[var(--button-font-weight)] transition-colors',
                  activeTab === tab.value
                    ? 'bg-[var(--card-bg)] shadow-[var(--card-shadow)]'
                    : 'hover:bg-[var(--card-bg)] hover:opacity-70',
                ].join(' ')}
                style={{ color: activeTab === tab.value ? 'var(--foreground)' : 'var(--foreground-secondary)' }}
                onClick={() => setActiveTab(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 月別フィルタ */}
          <div className="flex items-center gap-[var(--space-2)]">
            <Icon name="filter" size={16} />
            <select
              className={[
                'h-[var(--input-height)] px-[var(--input-px)] rounded-[var(--input-radius)]',
                'border text-[var(--input-font-size)] bg-[var(--background)]',
                'border-[var(--input-border)] focus:outline-2 focus:outline-[var(--input-focus-ring)]',
              ].join(' ')}
              style={{ color: 'var(--foreground)' }}
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option value="">全期間</option>
              <option value="2026年">2026年</option>
              <option value="2025年">2025年</option>
            </select>
          </div>
        </div>

        {/* 精算一覧 */}
        {filteredSettlements.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center gap-[var(--space-4)] py-[var(--space-16)] rounded-[var(--card-radius)] border"
            style={{ borderColor: 'var(--border)', background: 'var(--card-bg)' }}
          >
            <Icon name="chart" size={48} />
            <p className="text-[var(--text-base)] font-[var(--font-semibold)]" style={{ color: 'var(--foreground)' }}>
              精算データがありません
            </p>
            <Button variant="outline" size="sm" onClick={() => { setActiveTab('all'); setSelectedMonth('') }}>
              フィルターをリセット
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[var(--space-4)]">
            {filteredSettlements.map((settlement) => (
              <div key={settlement.id} className="cursor-pointer hover:opacity-90 transition-opacity">
                <SettlementSummaryCard
                  month={settlement.month}
                  status={settlement.status}
                  totalUsageFee={settlement.totalUsageFee}
                  commissionRate={settlement.commissionRate}
                  commissionAmount={settlement.commissionAmount}
                  settlementAmount={settlement.settlementAmount}
                  paymentDate={settlement.paymentDate}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ---- Meta ----

const meta: Meta<typeof SettlementConfirmPage> = {
  title: 'Pages/利用者/精算結果確認',
  component: SettlementConfirmPage,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof SettlementConfirmPage>

// ---- Stories ----

export const Default: Story = {
  args: {
    loading: false,
    initialTab: 'all',
    filterMonth: '',
  },
}

export const FilteredPaid: Story = {
  args: {
    loading: false,
    initialTab: 'paid',
    filterMonth: '',
  },
}

export const FilteredConfirmed: Story = {
  args: {
    loading: false,
    initialTab: 'confirmed',
    filterMonth: '',
  },
}

export const Loading: Story = {
  args: {
    loading: true,
    initialTab: 'all',
    filterMonth: '',
  },
}

export const NoResults: Story = {
  args: {
    loading: false,
    initialTab: 'calculating',
    filterMonth: '2025年',
  },
}
