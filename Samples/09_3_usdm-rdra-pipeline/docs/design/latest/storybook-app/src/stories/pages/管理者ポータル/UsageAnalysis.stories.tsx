import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { PortalShell } from '../../../components/layout/PortalShell'
import { DashboardChart } from '../../../components/domain/DashboardChart'
import { Card } from '../../../components/ui/Card'
import { Icon } from '../../../components/ui/Icon'

const meta: Meta = { title: 'Pages/管理者ポータル/利用状況分析' }
export default meta

const kpis = [
  { label: 'Bookings This Month', value: '156' },
  { label: 'Avg Occupancy Rate', value: '72%' },
  { label: 'Peak Hour', value: '14:00' },
  { label: 'Most Popular Area', value: 'Shibuya' },
]

export const Default: StoryObj = {
  render: () => (
    <PortalShell portal="admin" activeNav="Analytics">
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>Usage Analysis</h1>
      <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '24px' }}>
        {kpis.map(k => (
          <Card key={k.label}>
            <div style={{ padding: '16px', textAlign: 'center' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>{k.label}</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{k.value}</p>
            </div>
          </Card>
        ))}
      </div>
      <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: '1fr 1fr' }}>
        <Card>
          <div style={{ padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Icon name="chart" size={20} />
              <span style={{ fontWeight: 600 }}>Weekly Booking Trend</span>
            </div>
            <DashboardChart data={[]} type="line" title="" />
          </div>
        </Card>
        <Card>
          <div style={{ padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Icon name="chart" size={20} />
              <span style={{ fontWeight: 600 }}>Occupancy by Hour</span>
            </div>
            <DashboardChart data={[]} type="bar" title="" />
          </div>
        </Card>
      </div>
    </PortalShell>
  ),
}
