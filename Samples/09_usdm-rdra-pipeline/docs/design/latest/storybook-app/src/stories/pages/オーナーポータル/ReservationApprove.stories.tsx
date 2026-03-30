import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { PortalShell } from '../../../components/layout/PortalShell'
import { ReservationStatusBadge } from '../../../components/domain/ReservationStatusBadge'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Icon } from '../../../components/ui/Icon'

const meta: Meta = { title: 'Pages/オーナーポータル/利用許諾' }
export default meta

export const Default: StoryObj = {
  render: () => (
    <PortalShell portal="owner" activeNav="Reservations">
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>Approve Reservation</h1>
      <Card>
        <div style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icon name="room" size={20} />
              <span style={{ fontWeight: 600 }}>Sakura Room</span>
            </div>
            <ReservationStatusBadge status="仮予約" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '16px' }}>
            <div><span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Icon name="user" size={16} /> Suzuki</span></div>
            <div><span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Icon name="calendar" size={16} /> 2026-04-15</span></div>
            <div><span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Icon name="clock" size={16} /> 10:00 - 14:00</span></div>
            <div><span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Icon name="users" size={16} /> 8 people</span></div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button size="lg">Approve</Button>
            <Button variant="destructive" size="lg">Reject</Button>
          </div>
        </div>
      </Card>
    </PortalShell>
  ),
}
