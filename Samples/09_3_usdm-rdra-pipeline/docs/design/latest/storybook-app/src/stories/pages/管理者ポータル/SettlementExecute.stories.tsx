import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { PortalShell } from '../../../components/layout/PortalShell'
import { SettlementSummary } from '../../../components/domain/SettlementSummary'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Icon } from '../../../components/ui/Icon'

const meta: Meta = { title: 'Pages/管理者ポータル/精算実行' }
export default meta

export const Default: StoryObj = {
  render: () => (
    <PortalShell portal="admin" activeNav="Settlements">
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>Execute Settlement</h1>
      <SettlementSummary revenue={430000} commission={64500} payout={365500} period="2026-03" />
      <Card style={{ marginTop: '24px' }}>
        <div style={{ padding: '24px' }}>
          <h3 style={{ fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icon name="shield-check" size={20} /> Settlement Confirmation
          </h3>
          <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', lineHeight: 1.8, marginBottom: '16px' }}>
            <p>Target period: 2026-03-01 to 2026-03-31</p>
            <p>Number of owners: 3</p>
            <p>Total transactions: 42</p>
          </div>
          <div style={{ padding: '12px', backgroundColor: 'var(--warning-light)', borderRadius: '8px', marginBottom: '16px' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--warning)' }}>This action will initiate bank transfers to all owners. Please verify the amounts before proceeding.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button size="lg">Execute Settlement</Button>
            <Button variant="outline" size="lg">Cancel</Button>
          </div>
        </div>
      </Card>
    </PortalShell>
  ),
}
