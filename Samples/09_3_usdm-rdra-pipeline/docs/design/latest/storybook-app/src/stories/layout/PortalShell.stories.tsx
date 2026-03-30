import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { PortalShell } from '../../components/layout/PortalShell'

const meta: Meta<typeof PortalShell> = {
  title: 'Layout/PortalShell',
  component: PortalShell,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof PortalShell>

export const UserPortal: Story = {
  render: () => (
    <PortalShell portal="user" activeNav="Rooms">
      <div style={{ padding: '24px', color: 'var(--muted-foreground)' }}>User portal content area</div>
    </PortalShell>
  ),
}

export const OwnerPortal: Story = {
  render: () => (
    <PortalShell portal="owner" activeNav="Dashboard">
      <div style={{ padding: '24px', color: 'var(--muted-foreground)' }}>Owner portal content area</div>
    </PortalShell>
  ),
}

export const AdminPortal: Story = {
  render: () => (
    <PortalShell portal="admin" activeNav="Dashboard">
      <div style={{ padding: '24px', color: 'var(--muted-foreground)' }}>Admin portal content area</div>
    </PortalShell>
  ),
}
