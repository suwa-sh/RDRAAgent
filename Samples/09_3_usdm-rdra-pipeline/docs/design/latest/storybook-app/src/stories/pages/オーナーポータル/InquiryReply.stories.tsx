import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { PortalShell } from '../../../components/layout/PortalShell'
import { InquiryThread } from '../../../components/domain/InquiryThread'
import { InquiryStatusBadge } from '../../../components/domain/InquiryStatusBadge'
import { Icon } from '../../../components/ui/Icon'

const meta: Meta = { title: 'Pages/オーナーポータル/問合せ回答' }
export default meta

const sampleMessages = [
  { id: '1', sender: 'User: Suzuki', content: 'Is the projector HDMI or VGA?', timestamp: '2026-04-10 14:30', isOwn: false },
  { id: '2', sender: 'You', content: 'We have both HDMI and USB-C adapters available.', timestamp: '2026-04-10 15:00', isOwn: true },
]

export const Default: StoryObj = {
  render: () => (
    <PortalShell portal="owner" activeNav="Inquiries">
      <div style={{ maxWidth: '800px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <Icon name="message" size={24} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Inquiry Reply</h1>
          <InquiryStatusBadge status="対応中" />
        </div>
        <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '16px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Icon name="room" size={16} /> Sakura Room</span>
        </div>
        <InquiryThread messages={sampleMessages} onSend={() => {}} />
      </div>
    </PortalShell>
  ),
}
