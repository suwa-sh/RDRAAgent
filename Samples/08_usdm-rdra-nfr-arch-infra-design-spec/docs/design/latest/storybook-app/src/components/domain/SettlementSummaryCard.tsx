import React from 'react'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'

export type SettlementStatus = 'calculating' | 'confirmed' | 'paid' | 'failed'

export interface SettlementSummaryCardProps {
  month: string
  status: SettlementStatus
  totalUsageFee: number
  commissionRate: number
  commissionAmount: number
  settlementAmount: number
  paymentDate?: string
}

const statusConfig: Record<SettlementStatus, { label: string; variant: 'warning' | 'info' | 'success' | 'destructive' }> = {
  calculating: { label: '計算中', variant: 'warning' },
  confirmed:   { label: '確定',   variant: 'info' },
  paid:        { label: '支払済', variant: 'success' },
  failed:      { label: '失敗',   variant: 'destructive' },
}

const formatCurrency = (n: number) => `¥${n.toLocaleString()}`

export const SettlementSummaryCard: React.FC<SettlementSummaryCardProps> = ({
  month,
  status,
  totalUsageFee,
  commissionRate,
  commissionAmount,
  settlementAmount,
  paymentDate,
}) => {
  const { label, variant } = statusConfig[status]

  return (
    <Card>
      <div className="flex items-center justify-between mb-[var(--space-4)]">
        <h3 className="text-[var(--text-lg)] font-[var(--font-semibold)] text-[color:var(--foreground)]">
          {month} 精算
        </h3>
        <Badge variant={variant}>{label}</Badge>
      </div>

      <div className="border-t border-[var(--border)] pt-[var(--space-3)] flex flex-col gap-[var(--space-2)]">
        <div className="flex justify-between text-[var(--text-sm)]">
          <span className="text-[color:var(--foreground-secondary)]">利用料合計</span>
          <span className="text-[color:var(--foreground)]">{formatCurrency(totalUsageFee)}</span>
        </div>
        <div className="flex justify-between text-[var(--text-sm)]">
          <span className="text-[color:var(--foreground-secondary)]">手数料 ({commissionRate}%)</span>
          <span className="text-[color:var(--destructive)]">-{formatCurrency(commissionAmount)}</span>
        </div>
        <div className="border-t border-[var(--border)] pt-[var(--space-2)] flex justify-between">
          <span className="text-[var(--text-base)] font-[var(--font-semibold)] text-[color:var(--foreground)]">精算額</span>
          <span className="text-[var(--text-lg)] font-[var(--font-bold)] text-[color:var(--foreground)]">
            {formatCurrency(settlementAmount)}
          </span>
        </div>
        {paymentDate && (
          <div className="text-[var(--text-sm)] text-[color:var(--foreground-muted)] mt-[var(--space-1)]">
            支払予定日: {paymentDate}
          </div>
        )}
      </div>
    </Card>
  )
}
