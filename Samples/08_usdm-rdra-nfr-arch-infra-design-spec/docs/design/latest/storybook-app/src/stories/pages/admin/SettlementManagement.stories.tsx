import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React, { useState } from 'react'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { SettlementSummaryCard, type SettlementStatus } from '@/components/domain/SettlementSummaryCard'

const meta: Meta = {
  title: 'Pages/管理者/精算管理',
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

interface SettlementRow {
  id: string
  ownerName: string
  month: string
  usageFee: number
  commissionRate: number
  commissionAmount: number
  settlementAmount: number
  status: SettlementStatus
  paymentDate?: string
}

const settlements: SettlementRow[] = [
  {
    id: 'SET-001',
    ownerName: '田中太郎',
    month: '2026年2月',
    usageFee: 420000,
    commissionRate: 10,
    commissionAmount: 42000,
    settlementAmount: 378000,
    status: 'confirmed',
    paymentDate: '2026年4月15日',
  },
  {
    id: 'SET-002',
    ownerName: '佐藤花子',
    month: '2026年2月',
    usageFee: 180000,
    commissionRate: 10,
    commissionAmount: 18000,
    settlementAmount: 162000,
    status: 'confirmed',
    paymentDate: '2026年4月15日',
  },
  {
    id: 'SET-003',
    ownerName: '鈴木一郎',
    month: '2026年2月',
    usageFee: 95000,
    commissionRate: 10,
    commissionAmount: 9500,
    settlementAmount: 85500,
    status: 'calculating',
  },
  {
    id: 'SET-004',
    ownerName: '中村洋子',
    month: '2026年1月',
    usageFee: 320000,
    commissionRate: 10,
    commissionAmount: 32000,
    settlementAmount: 288000,
    status: 'paid',
    paymentDate: '2026年3月15日',
  },
  {
    id: 'SET-005',
    ownerName: '高橋美咲',
    month: '2026年1月',
    usageFee: 145000,
    commissionRate: 10,
    commissionAmount: 14500,
    settlementAmount: 130500,
    status: 'paid',
    paymentDate: '2026年3月15日',
  },
]

const statusLabelMap: Record<SettlementStatus, { label: string; variant: 'warning' | 'info' | 'success' | 'destructive' }> = {
  calculating: { label: '計算中',  variant: 'warning' },
  confirmed:   { label: '確定',    variant: 'info' },
  paid:        { label: '支払済',  variant: 'success' },
  failed:      { label: '失敗',    variant: 'destructive' },
}

/* ----------------------------------------------------------------
   Page component
---------------------------------------------------------------- */

const SettlementManagementPage: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('2026-02')
  const [isCalculating, setIsCalculating] = useState(false)
  const [calcDone, setCalcDone] = useState(false)

  const handleCalculate = () => {
    setIsCalculating(true)
    setTimeout(() => {
      setIsCalculating(false)
      setCalcDone(true)
    }, 1500)
  }

  const pendingSettlements = settlements.filter((s) => s.status === 'confirmed' || s.status === 'calculating')
  const paidSettlements = settlements.filter((s) => s.status === 'paid')

  return (
    <AdminLayout pageTitle="精算管理" activeNav="精算管理">
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 'var(--space-6)', alignItems: 'start' }}>
        {/* Left: control panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Month picker card */}
          <Card>
            <h2
              style={{
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-semibold)',
                color: 'var(--foreground)',
                marginBottom: 'var(--space-4)',
              }}
            >
              精算額計算
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'var(--font-medium)',
                    color: 'var(--foreground-secondary)',
                    marginBottom: 'var(--space-1)',
                  }}
                >
                  対象月
                </label>
                <input
                  type="month"
                  value={selectedMonth}
                  max="2026-02"
                  onChange={(e) => { setSelectedMonth(e.target.value); setCalcDone(false) }}
                  style={{
                    width: '100%',
                    height: 'var(--input-height)',
                    paddingLeft: 'var(--input-px)',
                    paddingRight: 'var(--input-px)',
                    borderRadius: 'var(--input-radius)',
                    border: '1px solid var(--input-border)',
                    fontSize: 'var(--input-font-size)',
                    background: 'var(--background)',
                    color: 'var(--foreground)',
                  }}
                />
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground-muted)', marginTop: 'var(--space-1)' }}>
                  ※ 当月以降は選択不可
                </p>
              </div>
              <Button
                variant="default"
                style={{ width: '100%', background: '#334155', justifyContent: 'center' }}
                loading={isCalculating}
                onClick={handleCalculate}
              >
                <Icon name="credit-card" size={14} />
                精算額を計算する
              </Button>
            </div>

            {calcDone && (
              <div
                style={{
                  marginTop: 'var(--space-3)',
                  padding: 'var(--space-3)',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--color-green-50)',
                  border: '1px solid var(--color-green-100)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                }}
              >
                <Icon name="shield-check" size={16} />
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-green-700)' }}>
                  精算額の計算が完了しました
                </span>
              </div>
            )}
          </Card>

          {/* Summary card for confirmed */}
          <SettlementSummaryCard
            month="2026年2月"
            status="confirmed"
            totalUsageFee={695000}
            commissionRate={10}
            commissionAmount={69500}
            settlementAmount={625500}
            paymentDate="2026年4月15日"
          />

          <Button
            variant="outline"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            精算実行へ
          </Button>
        </div>

        {/* Right: settlement list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Pending settlements */}
          <Card>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 'var(--space-4)',
              }}
            >
              <h2
                style={{
                  fontSize: 'var(--text-base)',
                  fontWeight: 'var(--font-semibold)',
                  color: 'var(--foreground)',
                }}
              >
                未精算一覧
              </h2>
              <Badge variant="warning">{pendingSettlements.length}件</Badge>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--table-header-bg)' }}>
                    {['オーナー名', '対象月', '利用料合計', '手数料', '精算額', '状態', '操作'].map((col) => (
                      <th
                        key={col}
                        style={{
                          padding: 'var(--table-cell-padding)',
                          textAlign: 'left',
                          fontSize: 'var(--text-xs)',
                          fontWeight: 'var(--table-header-weight)',
                          color: 'var(--foreground-secondary)',
                          borderBottom: '1px solid var(--table-border)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pendingSettlements.map((row) => {
                    const { label, variant } = statusLabelMap[row.status]
                    return (
                      <tr
                        key={row.id}
                        style={{
                          borderBottom: '1px solid var(--table-border)',
                          height: 'var(--table-row-height)',
                        }}
                      >
                        <td style={{ padding: 'var(--table-cell-padding)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--foreground)', whiteSpace: 'nowrap' }}>
                          {row.ownerName}
                        </td>
                        <td style={{ padding: 'var(--table-cell-padding)', fontSize: 'var(--text-sm)', color: 'var(--foreground)', whiteSpace: 'nowrap' }}>
                          {row.month}
                        </td>
                        <td style={{ padding: 'var(--table-cell-padding)', fontSize: 'var(--text-sm)', color: 'var(--foreground)', whiteSpace: 'nowrap' }}>
                          ¥{row.usageFee.toLocaleString()}
                        </td>
                        <td style={{ padding: 'var(--table-cell-padding)', fontSize: 'var(--text-sm)', color: 'var(--color-red-600)', whiteSpace: 'nowrap' }}>
                          -¥{row.commissionAmount.toLocaleString()}
                        </td>
                        <td style={{ padding: 'var(--table-cell-padding)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--foreground)', whiteSpace: 'nowrap' }}>
                          ¥{row.settlementAmount.toLocaleString()}
                        </td>
                        <td style={{ padding: 'var(--table-cell-padding)' }}>
                          <Badge variant={variant}>{label}</Badge>
                        </td>
                        <td style={{ padding: 'var(--table-cell-padding)' }}>
                          <Button variant="secondary" size="sm">詳細</Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Paid settlements */}
          <Card>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 'var(--space-4)',
              }}
            >
              <h2
                style={{
                  fontSize: 'var(--text-base)',
                  fontWeight: 'var(--font-semibold)',
                  color: 'var(--foreground)',
                }}
              >
                支払済一覧
              </h2>
              <Badge variant="success">{paidSettlements.length}件</Badge>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--table-header-bg)' }}>
                    {['オーナー名', '対象月', '精算額', '支払日', '状態'].map((col) => (
                      <th
                        key={col}
                        style={{
                          padding: 'var(--table-cell-padding)',
                          textAlign: 'left',
                          fontSize: 'var(--text-xs)',
                          fontWeight: 'var(--table-header-weight)',
                          color: 'var(--foreground-secondary)',
                          borderBottom: '1px solid var(--table-border)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paidSettlements.map((row) => {
                    const { label, variant } = statusLabelMap[row.status]
                    return (
                      <tr
                        key={row.id}
                        style={{
                          borderBottom: '1px solid var(--table-border)',
                          height: 'var(--table-row-height)',
                        }}
                      >
                        <td style={{ padding: 'var(--table-cell-padding)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--foreground)', whiteSpace: 'nowrap' }}>
                          {row.ownerName}
                        </td>
                        <td style={{ padding: 'var(--table-cell-padding)', fontSize: 'var(--text-sm)', color: 'var(--foreground)', whiteSpace: 'nowrap' }}>
                          {row.month}
                        </td>
                        <td style={{ padding: 'var(--table-cell-padding)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--foreground)', whiteSpace: 'nowrap' }}>
                          ¥{row.settlementAmount.toLocaleString()}
                        </td>
                        <td style={{ padding: 'var(--table-cell-padding)', fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)', whiteSpace: 'nowrap' }}>
                          {row.paymentDate}
                        </td>
                        <td style={{ padding: 'var(--table-cell-padding)' }}>
                          <Badge variant={variant}>{label}</Badge>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}

export const Default: Story = {
  render: () => <SettlementManagementPage />,
}
