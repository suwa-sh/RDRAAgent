import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { PortalShell } from '../../../components/layout/PortalShell'
import { ReservationStatusBadge } from '../../../components/domain/ReservationStatusBadge'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Icon } from '../../../components/ui/Icon'

const meta: Meta = { title: 'Pages/オーナーポータル/鍵返却' }
export default meta

export const Default: StoryObj = {
  render: () => (
    <PortalShell portal="owner" activeNav="Reservations">
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>Return Key</h1>
        <Card>
          <div style={{ padding: '24px', textAlign: 'center' }}>
            <Icon name="key" size={48} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '16px' }}>Sakura Room</h2>
            <div style={{ marginTop: '8px' }}><ReservationStatusBadge status="利用中" /></div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '0.875rem', color: 'var(--muted-foreground)', marginTop: '16px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Icon name="user" size={16} /> Suzuki</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Icon name="clock" size={16} /> 10:00 - 14:00</span>
            </div>
            <Button size="lg" style={{ marginTop: '24px' }}>Confirm Key Return</Button>
          </div>
        </Card>
      </div>
    </PortalShell>
  ),
}
