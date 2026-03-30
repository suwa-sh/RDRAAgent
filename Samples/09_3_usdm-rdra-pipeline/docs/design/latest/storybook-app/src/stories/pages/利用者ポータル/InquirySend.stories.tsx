import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { PortalShell } from '../../../components/layout/PortalShell'
import { InquiryThread } from '../../../components/domain/InquiryThread'
import { InquiryStatusBadge } from '../../../components/domain/InquiryStatusBadge'
import { Icon } from '../../../components/ui/Icon'

const meta: Meta = { title: 'Pages/利用者ポータル/問合せ送信' }
export default meta

const sampleMessages = [
  { id: '1', sender: 'You', content: 'Is the projector available for the meeting on April 15?', timestamp: '2026-04-10 14:30', isOwn: true },
  { id: '2', sender: 'Sakura Room Owner', content: 'Yes, the projector is available. You can also use the whiteboard.', timestamp: '2026-04-10 15:00', isOwn: false },
]

export const Default: StoryObj = {
  render: () => (
    <PortalShell portal="user" activeNav="Reservations">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <Icon name="message" size={24} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Inquiry</h1>
          <InquiryStatusBadge status="対応中" />
        </div>
        <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '16px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Icon name="room" size={16} /> Sakura Room - Shibuya</span>
        </div>
        <InquiryThread messages={sampleMessages} onSend={() => {}} />
      </div>
    </PortalShell>
  ),
}
