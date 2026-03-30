import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { PortalShell } from '../../../components/layout/PortalShell'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Icon } from '../../../components/ui/Icon'

const meta: Meta = { title: 'Pages/オーナーポータル/退会申請' }
export default meta

export const Default: StoryObj = {
  render: () => (
    <PortalShell portal="owner" activeNav="Profile">
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>Withdraw from Service</h1>
        <Card>
          <div style={{ padding: '24px' }}>
            <div style={{ padding: '16px', backgroundColor: 'var(--destructive-light)', borderRadius: '8px', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--destructive)', marginBottom: '8px' }}>
                <Icon name="shield-check" size={20} /> Important Notice
              </h3>
              <ul style={{ fontSize: '0.875rem', color: 'var(--destructive)', listStyle: 'disc', paddingLeft: '20px', lineHeight: 1.8 }}>
                <li>All room listings will be permanently removed</li>
                <li>Active reservations will be cancelled</li>
                <li>Pending settlements will be processed before withdrawal</li>
                <li>This action cannot be undone</li>
              </ul>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button variant="destructive" size="lg">Request Withdrawal</Button>
              <Button variant="outline" size="lg">Cancel</Button>
            </div>
          </div>
        </Card>
      </div>
    </PortalShell>
  ),
}
