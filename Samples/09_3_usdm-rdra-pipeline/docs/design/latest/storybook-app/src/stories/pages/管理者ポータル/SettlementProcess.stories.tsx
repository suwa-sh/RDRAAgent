import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { PortalShell } from '../../../components/layout/PortalShell'
import { SettlementSummary } from '../../../components/domain/SettlementSummary'
import { PriceDisplay } from '../../../components/domain/PriceDisplay'
import { Card } from '../../../components/ui/Card'
import { Icon } from '../../../components/ui/Icon'

const meta: Meta = { title: 'Pages/管理者ポータル/精算処理' }
export default meta

const settlements = [
  { owner: 'ABC Corp', revenue: 150000, commission: 22500, payout: 127500 },
  { owner: 'XYZ Inc', revenue: 80000, commission: 12000, payout: 68000 },
  { owner: 'DEF Ltd', revenue: 200000, commission: 30000, payout: 170000 },
]

export const Default: StoryObj = {
  render: () => (
    <PortalShell portal="admin" activeNav="Settlements">
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Settlement Processing</h1>
      <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '24px' }}>Period: 2026-03</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {settlements.map((s, i) => (
          <Card key={i}>
            <div style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Icon name="user" size={16} /> {s.owner}</span>
                <PriceDisplay amount={s.payout} size="md" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                <div>Revenue: <PriceDisplay amount={s.revenue} size="sm" /></div>
                <div>Commission: <PriceDisplay amount={s.commission} size="sm" /></div>
                <div>Payout: <PriceDisplay amount={s.payout} size="sm" /></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </PortalShell>
  ),
}
