import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { PortalShell } from '../../../components/layout/PortalShell'
import { ReservationStatusBadge } from '../../../components/domain/ReservationStatusBadge'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Icon } from '../../../components/ui/Icon'
import { PriceDisplay } from '../../../components/domain/PriceDisplay'

const meta: Meta = { title: 'Pages/利用者ポータル/予約取消' }
export default meta

export const Default: StoryObj = {
  render: () => (
    <PortalShell portal="user" activeNav="Reservations">
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>Cancel Reservation</h1>
        <Card>
          <div style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontWeight: 600 }}>Sakura Room</span>
              <ReservationStatusBadge status="確定" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon name="calendar" size={16} /> 2026-04-15
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon name="clock" size={16} /> 10:00 - 12:00
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon name="map-pin" size={16} /> Shibuya, Tokyo
              </div>
            </div>
            <div style={{ padding: '12px', backgroundColor: 'var(--destructive-light)', borderRadius: '8px', marginBottom: '16px' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--destructive)', fontWeight: 500 }}>Cancellation is irreversible. Refund: <PriceDisplay amount={3000} size="sm" /></p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button variant="destructive" size="lg">Confirm Cancel</Button>
              <Button variant="outline" size="lg">Go Back</Button>
            </div>
          </div>
        </Card>
      </div>
    </PortalShell>
  ),
}
