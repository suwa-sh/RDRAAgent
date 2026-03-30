import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { PortalShell } from '../../../components/layout/PortalShell'
import { ReservationStatusBadge } from '../../../components/domain/ReservationStatusBadge'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Icon } from '../../../components/ui/Icon'

const meta: Meta = { title: 'Pages/利用者ポータル/鍵受取確認' }
export default meta

export const Default: StoryObj = {
  render: () => (
    <PortalShell portal="user" activeNav="Reservations">
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>Key Pickup Confirmation</h1>
        <Card>
          <div style={{ padding: '24px', textAlign: 'center' }}>
            <Icon name="key" size={48} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '16px' }}>Sakura Room</h2>
            <div style={{ marginTop: '8px' }}><ReservationStatusBadge status="確定" /></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem', color: 'var(--muted-foreground)', marginTop: '16px', alignItems: 'center' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Icon name="calendar" size={16} /> 2026-04-15</div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Icon name="clock" size={16} /> 10:00 - 12:00</div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Icon name="map-pin" size={16} /> Shibuya, Tokyo</div>
            </div>
            <div style={{ padding: '16px', backgroundColor: 'var(--info-light)', borderRadius: '8px', marginTop: '24px' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--info)' }}>Please confirm key receipt when you arrive at the venue.</p>
            </div>
            <Button size="lg" style={{ marginTop: '24px' }}>Confirm Key Receipt</Button>
          </div>
        </Card>
      </div>
    </PortalShell>
  ),
}
