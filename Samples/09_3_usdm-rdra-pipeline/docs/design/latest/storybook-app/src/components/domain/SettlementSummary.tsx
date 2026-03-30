import React from 'react'
import { Card } from '../ui/Card'
import { PriceDisplay } from './PriceDisplay'
import { Icon } from '../ui/Icon'

export interface SettlementSummaryProps {
  revenue: number
  commission: number
  payout: number
  period: string
}

export const SettlementSummary: React.FC<SettlementSummaryProps> = ({
  revenue,
  commission,
  payout,
  period,
}) => (
  <Card>
    <div className="flex items-center gap-2 mb-4">
      <Icon name="credit-card" size={20} />
      <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>精算サマリー</h3>
      <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>({period})</span>
    </div>
    <div className="grid grid-cols-3 gap-4">
      <div className="text-center">
        <div className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>売上合計</div>
        <PriceDisplay amount={revenue} size="md" />
      </div>
      <div className="text-center">
        <div className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>手数料</div>
        <div className="text-lg font-semibold" style={{ color: 'var(--destructive)' }}>
          -<PriceDisplay amount={commission} size="sm" />
        </div>
      </div>
      <div className="text-center">
        <div className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>支払額</div>
        <div className="text-lg font-bold" style={{ color: 'var(--success)' }}>
          <PriceDisplay amount={payout} size="lg" />
        </div>
      </div>
    </div>
  </Card>
)
