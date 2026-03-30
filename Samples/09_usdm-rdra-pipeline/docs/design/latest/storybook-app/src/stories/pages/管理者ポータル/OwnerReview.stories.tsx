import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { PortalShell } from '../../../components/layout/PortalShell'
import { OwnerStatusBadge } from '../../../components/domain/OwnerStatusBadge'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'

const meta: Meta = { title: 'Pages/管理者ポータル/オーナー審査' }
export default meta

export const Default: StoryObj = {
  render: () => (
    <PortalShell portal="admin" activeNav="Owners">
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Owner Review</h1>
      <Card>
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Suzuki Ichiro</h2>
            <OwnerStatusBadge status="applied" />
          </div>
          <dl style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px', fontSize: '0.875rem' }}>
            <dt style={{ color: 'var(--muted-foreground)' }}>Email</dt><dd>suzuki@example.com</dd>
            <dt style={{ color: 'var(--muted-foreground)' }}>Phone</dt><dd>090-1234-5678</dd>
            <dt style={{ color: 'var(--muted-foreground)' }}>Profile</dt><dd>Meeting room owner in Shibuya area with 5 years experience.</dd>
          </dl>
          <div style={{ display: 'flex', gap: '8px', marginTop: '24px', justifyContent: 'flex-end' }}>
            <Button variant="destructive">Reject</Button>
            <Button>Approve</Button>
          </div>
        </div>
      </Card>
    </PortalShell>
  ),
}
