import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { PortalShell } from '../../../components/layout/PortalShell'
import { OwnerStatusBadge } from '../../../components/domain/OwnerStatusBadge'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Icon } from '../../../components/ui/Icon'

const meta: Meta = { title: 'Pages/オーナーポータル/オーナー申請' }
export default meta

export const Default: StoryObj = {
  render: () => (
    <PortalShell portal="owner" activeNav="Profile">
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>Owner Application</h1>
        <Card>
          <div style={{ padding: '24px', textAlign: 'center' }}>
            <Icon name="user" size={48} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '16px' }}>ABC Corporation</h2>
            <div style={{ marginTop: '8px' }}><OwnerStatusBadge status="未申請" /></div>
            <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginTop: '16px' }}>
              Submit your application to start listing meeting rooms on RoomConnect.
            </p>
            <Button size="lg" style={{ marginTop: '24px' }}>Submit Application</Button>
          </div>
        </Card>
      </div>
    </PortalShell>
  ),
}

export const Pending: StoryObj = {
  render: () => (
    <PortalShell portal="owner" activeNav="Profile">
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>Owner Application</h1>
        <Card>
          <div style={{ padding: '24px', textAlign: 'center' }}>
            <Icon name="user" size={48} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '16px' }}>ABC Corporation</h2>
            <div style={{ marginTop: '8px' }}><OwnerStatusBadge status="申請中" /></div>
            <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginTop: '16px' }}>
              Your application is being reviewed. We will notify you within 3 business days.
            </p>
          </div>
        </Card>
      </div>
    </PortalShell>
  ),
}
