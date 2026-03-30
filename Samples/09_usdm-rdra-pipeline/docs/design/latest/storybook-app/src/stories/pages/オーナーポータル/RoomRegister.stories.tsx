import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { PortalShell } from '../../../components/layout/PortalShell'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'

const meta: Meta = { title: 'Pages/オーナーポータル/会議室登録' }
export default meta

export const Default: StoryObj = {
  render: () => (
    <PortalShell portal="owner" activeNav="Rooms">
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>Register Room</h1>
      <div style={{ maxWidth: '640px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div><label style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Room Name</label><Input placeholder="Meeting Room A" /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div><label style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Area (sqm)</label><Input type="number" placeholder="30" /></div>
            <div><label style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Price (JPY/hr)</label><Input type="number" placeholder="3000" /></div>
          </div>
          <div><label style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Location</label><Input placeholder="Shibuya, Tokyo" /></div>
          <div><label style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Features</label><Input placeholder="Projector, Whiteboard, Wi-Fi" /></div>
          <Button size="lg">Register</Button>
        </div>
      </div>
    </PortalShell>
  ),
}
