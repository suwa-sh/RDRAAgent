import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { PortalShell } from '../../../components/layout/PortalShell'
import { OwnerStatusBadge } from '../../../components/domain/OwnerStatusBadge'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Icon } from '../../../components/ui/Icon'

const meta: Meta = { title: 'Pages/管理者ポータル/退会処理' }
export default meta

export const Default: StoryObj = {
  render: () => (
    <PortalShell portal="admin" activeNav="Owners">
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>Process Withdrawal</h1>
      <Card>
        <div style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <span style={{ fontWeight: 600, fontSize: '1.125rem' }}>ABC Corporation</span>
              <span style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginLeft: '8px' }}>Taro Yamada</span>
            </div>
            <OwnerStatusBadge status="承認" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '16px' }}>
            <div><span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Icon name="room" size={16} /> 3 active rooms</span></div>
            <div><span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Icon name="calendar" size={16} /> 2 pending reservations</span></div>
            <div><span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Icon name="credit-card" size={16} /> Settlement pending: 45,000 JPY</span></div>
          </div>
          <div style={{ padding: '12px', backgroundColor: 'var(--warning-light)', borderRadius: '8px', marginBottom: '16px' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--warning)' }}>Pending reservations will be cancelled and settlement will be processed before withdrawal.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button variant="destructive" size="lg">Process Withdrawal</Button>
            <Button variant="outline" size="lg">Cancel</Button>
          </div>
        </div>
      </Card>
    </PortalShell>
  ),
}
