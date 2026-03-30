import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { PortalShell } from '../../../components/layout/PortalShell'
import { Card } from '../../../components/ui/Card'

const meta: Meta = { title: 'Pages/オーナーポータル/規約参照' }
export default meta

export const Default: StoryObj = {
  render: () => (
    <PortalShell portal="owner" activeNav="Profile">
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>Terms of Service</h1>
      <Card>
        <div style={{ padding: '24px', lineHeight: 1.8, fontSize: '0.875rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '12px' }}>Chapter 1: General Provisions</h2>
          <p style={{ color: 'var(--muted-foreground)', marginBottom: '16px' }}>
            These Terms of Service define the conditions for using the RoomConnect meeting room sharing service.
            By registering as an owner, you agree to these terms.
          </p>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '12px' }}>Chapter 2: Owner Responsibilities</h2>
          <p style={{ color: 'var(--muted-foreground)', marginBottom: '16px' }}>
            Owners are responsible for maintaining the quality and safety of listed meeting rooms.
            Regular inspections and maintenance are required.
          </p>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '12px' }}>Chapter 3: Fee Structure</h2>
          <p style={{ color: 'var(--muted-foreground)' }}>
            A service commission of 15% is applied to each completed booking. Settlement is processed monthly.
          </p>
        </div>
      </Card>
    </PortalShell>
  ),
}
