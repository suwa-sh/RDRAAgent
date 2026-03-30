import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { PortalShell } from '../../../components/layout/PortalShell'
import { SettlementSummary } from '../../../components/domain/SettlementSummary'
import { PriceDisplay } from '../../../components/domain/PriceDisplay'

const meta: Meta = { title: 'Pages/オーナーポータル/精算結果確認' }
export default meta

export const Default: StoryObj = {
  render: () => (
    <PortalShell portal="owner" activeNav="Settlements">
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>Settlement Results</h1>
      <SettlementSummary revenue={150000} commission={15000} payout={135000} period="2026-03" />
      <div style={{ marginTop: '24px' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '12px' }}>History</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead><tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
            <th style={{ padding: '12px 16px' }}>Period</th><th style={{ padding: '12px 16px' }}>Revenue</th><th style={{ padding: '12px 16px' }}>Commission</th><th style={{ padding: '12px 16px' }}>Payout</th>
          </tr></thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '12px 16px' }}>2026-03</td><td style={{ padding: '12px 16px' }}><PriceDisplay amount={150000} currency="JPY" size="sm" /></td><td style={{ padding: '12px 16px' }}><PriceDisplay amount={15000} currency="JPY" size="sm" /></td><td style={{ padding: '12px 16px' }}><PriceDisplay amount={135000} currency="JPY" size="sm" /></td></tr>
            <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '12px 16px' }}>2026-02</td><td style={{ padding: '12px 16px' }}><PriceDisplay amount={120000} currency="JPY" size="sm" /></td><td style={{ padding: '12px 16px' }}><PriceDisplay amount={12000} currency="JPY" size="sm" /></td><td style={{ padding: '12px 16px' }}><PriceDisplay amount={108000} currency="JPY" size="sm" /></td></tr>
          </tbody>
        </table>
      </div>
    </PortalShell>
  ),
}
