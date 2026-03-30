import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { PortalShell } from '../../../components/layout/PortalShell'
import { DashboardChart } from '../../../components/domain/DashboardChart'
import { PriceDisplay } from '../../../components/domain/PriceDisplay'
import { Card } from '../../../components/ui/Card'
import { Icon } from '../../../components/ui/Icon'

const meta: Meta = { title: 'Pages/管理者ポータル/手数料分析' }
export default meta

const kpis = [
  { label: 'Monthly Revenue', amount: 2500000 },
  { label: 'Commission (15%)', amount: 375000 },
  { label: 'YTD Commission', amount: 1125000 },
]

export const Default: StoryObj = {
  render: () => (
    <PortalShell portal="admin" activeNav="Analytics">
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>Commission Analysis</h1>
      <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '24px' }}>
        {kpis.map(k => (
          <Card key={k.label}>
            <div style={{ padding: '16px', textAlign: 'center' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '4px' }}>{k.label}</p>
              <PriceDisplay amount={k.amount} size="lg" />
            </div>
          </Card>
        ))}
      </div>
      <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: '1fr 1fr' }}>
        <Card>
          <div style={{ padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Icon name="chart" size={20} />
              <span style={{ fontWeight: 600 }}>Monthly Commission Trend</span>
            </div>
            <DashboardChart data={[]} type="line" title="" />
          </div>
        </Card>
        <Card>
          <div style={{ padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Icon name="chart" size={20} />
              <span style={{ fontWeight: 600 }}>Commission by Area</span>
            </div>
            <DashboardChart data={[]} type="bar" title="" />
          </div>
        </Card>
      </div>
    </PortalShell>
  ),
}
