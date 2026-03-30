import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { PortalShell } from '../../../components/layout/PortalShell'
import { BookingCalendar } from '../../../components/domain/BookingCalendar'
import { PriceDisplay } from '../../../components/domain/PriceDisplay'
import { Button } from '../../../components/ui/Button'

const meta: Meta = { title: 'Pages/利用者ポータル/予約申込' }
export default meta

export const Default: StoryObj = {
  render: () => (
    <PortalShell portal="user" activeNav="Reservations">
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Booking</h1>
      <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: '1fr 320px' }}>
        <div>
          <BookingCalendar selectedDate={new Date()} startTime="10:00" endTime="12:00" onSelect={() => {}} />
        </div>
        <div style={{ padding: '16px', border: '1px solid var(--border)', borderRadius: '12px' }}>
          <h3 style={{ fontWeight: 600, marginBottom: '12px' }}>Summary</h3>
          <p>Sakura Room</p>
          <p>2026/04/01 10:00-12:00</p>
          <div style={{ margin: '16px 0' }}><PriceDisplay amount={6000} currency="JPY" size="lg" /></div>
          <Button size="lg" style={{ width: '100%' }}>Book</Button>
        </div>
      </div>
    </PortalShell>
  ),
}
