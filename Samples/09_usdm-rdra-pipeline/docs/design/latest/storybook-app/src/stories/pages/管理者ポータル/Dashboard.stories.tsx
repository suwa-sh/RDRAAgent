import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { PortalShell } from '../../../components/layout/PortalShell'
import { DashboardChart } from '../../../components/domain/DashboardChart'
import { Card } from '../../../components/ui/Card'

const meta: Meta = { title: 'Pages/管理者ポータル/運用管理ダッシュボード' }
export default meta

const kpis = [
  { label: 'Active Owners', value: '42' },
  { label: 'Active Rooms', value: '156' },
  { label: "Today's Bookings", value: '23' },
  { label: 'Pending Inquiries', value: '5' },
]

export const Default: StoryObj = {
  render: () => (
    <PortalShell portal="admin" activeNav="Dashboard">
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Dashboard</h1>
      <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '24px' }}>
        {kpis.map(k => (
          <Card key={k.label}>
            <div style={{ padding: '16px', textAlign: 'center' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>{k.label}</p>
              <p style={{ fontSize: '2rem', fontWeight: 700 }}>{k.value}</p>
            </div>
          </Card>
        ))}
      </div>
      <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: '1fr 1fr' }}>
        <Card><div style={{ padding: '16px' }}><DashboardChart data={[]} type="line" title="Booking Trend" /></div></Card>
        <Card><div style={{ padding: '16px' }}><DashboardChart data={[]} type="bar" title="Room Usage" /></div></Card>
      </div>
    </PortalShell>
  ),
}
