import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { PortalShell } from '../../../components/layout/PortalShell'
import { BookingCalendar } from '../../../components/domain/BookingCalendar'
import { ReservationStatusBadge } from '../../../components/domain/ReservationStatusBadge'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Icon } from '../../../components/ui/Icon'

const meta: Meta = { title: 'Pages/利用者ポータル/予約変更' }
export default meta

export const Default: StoryObj = {
  render: () => (
    <PortalShell portal="user" activeNav="Reservations">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Change Reservation</h1>
          <ReservationStatusBadge status="確定" />
        </div>
        <Card>
          <div style={{ padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Icon name="room" size={20} />
              <span style={{ fontWeight: 600 }}>Sakura Room</span>
              <span style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>- Shibuya</span>
            </div>
            <BookingCalendar selectedDate={new Date()} startTime="10:00" endTime="12:00" onSelect={() => {}} />
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <Button size="lg">Save Changes</Button>
              <Button variant="outline" size="lg">Cancel</Button>
            </div>
          </div>
        </Card>
      </div>
    </PortalShell>
  ),
}
