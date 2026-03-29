import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { SettlementSummaryCard } from '@/components/domain/SettlementSummaryCard'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'

/* ------------------------------------------------------------------ */
/* Types                                                                */
/* ------------------------------------------------------------------ */

type PaymentStatus = 'pending' | 'processing' | 'paid' | 'failed'

interface SettlementItem {
  id: string
  ownerName: string
  ownerId: string
  month: string
  totalUsageFee: number
  commissionRate: number
  commissionAmount: number
  settlementAmount: number
  paymentStatus: PaymentStatus
}

/* ------------------------------------------------------------------ */
/* Mock data                                                             */
/* ------------------------------------------------------------------ */

const mockSettlements: SettlementItem[] = [
  {
    id: 'STL-2026-001',
    ownerName: '田中 一郎',
    ownerId: 'OWN-001',
    month: '2026年3月',
    totalUsageFee: 60_000,
    commissionRate: 15,
    commissionAmount: 9_000,
    settlementAmount: 51_000,
    paymentStatus: 'pending',
  },
  {
    id: 'STL-2026-002',
    ownerName: '佐藤 美咲',
    ownerId: 'OWN-002',
    month: '2026年3月',
    totalUsageFee: 120_000,
    commissionRate: 15,
    commissionAmount: 18_000,
    settlementAmount: 102_000,
    paymentStatus: 'pending',
  },
  {
    id: 'STL-2026-003',
    ownerName: '鈴木 健二',
    ownerId: 'OWN-003',
    month: '2026年3月',
    totalUsageFee: 85_000,
    commissionRate: 15,
    commissionAmount: 12_750,
    settlementAmount: 72_250,
    paymentStatus: 'pending',
  },
  {
    id: 'STL-2026-004',
    ownerName: '伊藤 良子',
    ownerId: 'OWN-004',
    month: '2026年3月',
    totalUsageFee: 42_000,
    commissionRate: 15,
    commissionAmount: 6_300,
    settlementAmount: 35_700,
    paymentStatus: 'pending',
  },
]

const paymentStatusConfig: Record<PaymentStatus, { label: string; variant: 'warning' | 'info' | 'success' | 'destructive' | 'default' }> = {
  pending:    { label: '精算待ち', variant: 'warning' },
  processing: { label: '処理中',   variant: 'info' },
  paid:       { label: '支払済',   variant: 'success' },
  failed:     { label: '失敗',     variant: 'destructive' },
}

const formatCurrency = (n: number) => `¥${n.toLocaleString()}`

/* ------------------------------------------------------------------ */
/* Inner component                                                       */
/* ------------------------------------------------------------------ */

const SettlementExecutionPage: React.FC<{
  initialStatuses?: Record<string, PaymentStatus>
}> = ({ initialStatuses = {} }) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const [paymentStatuses, setPaymentStatuses] = useState<Record<string, PaymentStatus>>(
    Object.fromEntries(mockSettlements.map((s) => [s.id, initialStatuses[s.id] ?? s.paymentStatus]))
  )
  const [completeBanner, setCompleteBanner] = useState(false)

  const pendingItems = mockSettlements.filter((s) => paymentStatuses[s.id] === 'pending')
  const allSelected = pendingItems.length > 0 && pendingItems.every((s) => selectedIds.has(s.id))

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(pendingItems.map((s) => s.id)))
    }
  }

  const toggleItem = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectedItems = mockSettlements.filter((s) => selectedIds.has(s.id))
  const totalSelectedAmount = selectedItems.reduce((sum, s) => sum + s.settlementAmount, 0)

  const handleExecute = () => {
    setShowConfirmDialog(false)
    setIsExecuting(true)

    // Mark selected as processing
    setPaymentStatuses((prev) => {
      const next = { ...prev }
      selectedIds.forEach((id) => { next[id] = 'processing' })
      return next
    })
    setSelectedIds(new Set())

    // Simulate async completion
    setTimeout(() => {
      setPaymentStatuses((prev) => {
        const next = { ...prev }
        Object.keys(next).forEach((id) => {
          if (next[id] === 'processing') next[id] = 'paid'
        })
        return next
      })
      setIsExecuting(false)
      setCompleteBanner(true)
    }, 2500)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 900 }}>
      {/* Page header */}
      <div>
        <h2
          style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--foreground)', margin: 0, marginBottom: 4 }}
        >
          精算実行
        </h2>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)', margin: 0 }}>
          精算計算済みのオーナー精算を選択して実行します。この操作は取り消せません。
        </p>
      </div>

      {/* Complete banner */}
      {completeBanner && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 16px',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--success-light)',
          }}
        >
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--color-green-700)' }}>
            精算処理が完了しました。決済機関への送金リクエストが送信されました。
          </span>
        </div>
      )}

      {/* Selection summary */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                style={{ width: 16, height: 16, cursor: 'pointer' }}
              />
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--foreground)' }}>
                全件選択
              </span>
            </label>
            {selectedIds.size > 0 && (
              <Badge variant="info">{selectedIds.size}件選択中 / 合計 {formatCurrency(totalSelectedAmount)}</Badge>
            )}
          </div>
          <Button
            variant="destructive"
            size="md"
            disabled={selectedIds.size === 0 || isExecuting}
            onClick={() => setShowConfirmDialog(true)}
          >
            <Icon name="credit-card" size={16} />
            精算を実行する
          </Button>
        </div>

        {/* Settlement table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)' }}>
                <th style={{ padding: '10px 12px', width: 40 }} />
                {['精算ID', 'オーナー名', '対象月', '精算額', '状態'].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: '10px 12px',
                      textAlign: 'left',
                      color: 'var(--foreground-secondary)',
                      fontWeight: 'var(--font-medium)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockSettlements.map((s) => {
                const status = paymentStatuses[s.id]
                const { label, variant } = paymentStatusConfig[status]
                const isPending = status === 'pending'
                const isProcessing = status === 'processing'

                return (
                  <tr
                    key={s.id}
                    style={{
                      borderBottom: '1px solid var(--border)',
                      background: selectedIds.has(s.id) ? 'var(--color-gray-50)' : 'transparent',
                      opacity: !isPending && !isProcessing ? 0.7 : 1,
                    }}
                  >
                    <td style={{ padding: '10px 12px' }}>
                      {isPending && (
                        <input
                          type="checkbox"
                          checked={selectedIds.has(s.id)}
                          onChange={() => toggleItem(s.id)}
                          style={{ width: 16, height: 16, cursor: 'pointer' }}
                        />
                      )}
                    </td>
                    <td style={{ padding: '10px 12px', color: 'var(--foreground-secondary)', fontFamily: 'monospace', fontSize: 'var(--text-xs)' }}>
                      {s.id}
                    </td>
                    <td style={{ padding: '10px 12px', color: 'var(--foreground)' }}>
                      {s.ownerName}
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground-muted)', marginLeft: 6 }}>({s.ownerId})</span>
                    </td>
                    <td style={{ padding: '10px 12px', color: 'var(--foreground)' }}>{s.month}</td>
                    <td style={{ padding: '10px 12px', color: 'var(--foreground)', textAlign: 'right', fontWeight: 'var(--font-semibold)' }}>
                      {formatCurrency(s.settlementAmount)}
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Badge variant={variant}>{label}</Badge>
                        {isProcessing && (
                          <svg className="animate-spin" width={14} height={14} viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="var(--color-blue-600)" strokeWidth={3} strokeOpacity={0.25} />
                            <path d="M4 12a8 8 0 018-8V0" stroke="var(--color-blue-600)" strokeWidth={3} strokeLinecap="round" />
                          </svg>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Settlement summary cards for selected items */}
      {selectedIds.size > 0 && (
        <div>
          <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--foreground)', marginBottom: 12 }}>
            選択中の精算詳細
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {mockSettlements
              .filter((s) => selectedIds.has(s.id))
              .map((s) => (
                <SettlementSummaryCard
                  key={s.id}
                  month={s.month}
                  status="confirmed"
                  totalUsageFee={s.totalUsageFee}
                  commissionRate={s.commissionRate}
                  commissionAmount={s.commissionAmount}
                  settlementAmount={s.settlementAmount}
                />
              ))}
          </div>
        </div>
      )}

      {/* Confirm dialog */}
      {showConfirmDialog && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
          }}
        >
          <div
            style={{
              background: 'var(--card-bg)',
              borderRadius: 'var(--card-radius)',
              padding: 'var(--space-6)',
              width: 520,
              maxWidth: '90vw',
              boxShadow: 'var(--card-shadow-hover)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-bold)', color: 'var(--foreground)' }}>
                精算実行の確認
              </span>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)', marginBottom: 8 }}>
              <strong>{selectedIds.size}件</strong>の精算を実行します。
            </p>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)', marginBottom: 16 }}>
              合計精算額: <strong style={{ color: '#DC2626' }}>{formatCurrency(totalSelectedAmount)}</strong>
            </p>
            <div
              style={{
                background: 'var(--destructive-light)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-red-700)' }}>
                この操作は取り消せません。
              </span>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                キャンセル
              </Button>
              <Button variant="destructive" onClick={handleExecute}>
                実行する
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Story meta                                                            */
/* ------------------------------------------------------------------ */

const meta: Meta = {
  title: 'Pages/管理者/精算実行',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => {
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-portal', 'admin')
      }
      return (
        <AdminLayout pageTitle="精算実行" activeNav="精算管理">
          <Story />
        </AdminLayout>
      )
    },
  ],
}

export default meta
type Story = StoryObj<typeof meta>

/* ------------------------------------------------------------------ */
/* Stories                                                              */
/* ------------------------------------------------------------------ */

export const Default: Story = {
  name: '標準（精算待ち一覧）',
  render: () => <SettlementExecutionPage />,
}

export const PartiallyPaid: Story = {
  name: '一部支払済み',
  render: () => (
    <SettlementExecutionPage
      initialStatuses={{
        'STL-2026-001': 'paid',
        'STL-2026-002': 'paid',
        'STL-2026-003': 'pending',
        'STL-2026-004': 'pending',
      }}
    />
  ),
}

export const WithFailure: Story = {
  name: '失敗あり',
  render: () => (
    <SettlementExecutionPage
      initialStatuses={{
        'STL-2026-001': 'paid',
        'STL-2026-002': 'failed',
        'STL-2026-003': 'paid',
        'STL-2026-004': 'pending',
      }}
    />
  ),
}
