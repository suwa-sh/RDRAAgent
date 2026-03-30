import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { PortalShell } from '../../../components/layout/PortalShell'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Icon } from '../../../components/ui/Icon'

const meta: Meta = { title: 'Pages/オーナーポータル/運用ルール設定' }
export default meta

export const Default: StoryObj = {
  render: () => (
    <PortalShell portal="owner" activeNav="Rooms">
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>Operating Rules</h1>
      <div style={{ maxWidth: '640px' }}>
        <Card>
          <div style={{ padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Icon name="settings" size={20} />
              <span style={{ fontWeight: 600 }}>Sakura Room</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Input label="Business Hours (Start)" type="text" placeholder="09:00" />
              <Input label="Business Hours (End)" type="text" placeholder="21:00" />
              <Input label="Minimum Booking Duration (hours)" type="number" placeholder="1" />
              <Input label="Maximum Booking Duration (hours)" type="number" placeholder="8" />
              <Input label="Advance Booking Limit (days)" type="number" placeholder="30" />
              <Input label="Cancellation Policy (hours before)" type="number" placeholder="24" />
              <Button size="lg">Save Rules</Button>
            </div>
          </div>
        </Card>
      </div>
    </PortalShell>
  ),
}
