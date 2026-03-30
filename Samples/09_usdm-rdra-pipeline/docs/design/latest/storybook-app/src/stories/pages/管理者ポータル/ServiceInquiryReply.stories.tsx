import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { PortalShell } from '../../../components/layout/PortalShell'
import { InquiryThread } from '../../../components/domain/InquiryThread'
import { InquiryStatusBadge } from '../../../components/domain/InquiryStatusBadge'
import { Icon } from '../../../components/ui/Icon'

const meta: Meta = { title: 'Pages/管理者ポータル/サービス問合せ回答' }
export default meta

const sampleMessages = [
  { id: '1', sender: 'User: Suzuki', content: 'My refund has not been processed yet. It has been more than 5 days since cancellation.', timestamp: '2026-04-10 09:00', isOwn: false },
  { id: '2', sender: 'Admin', content: 'We apologize for the delay. Let me check the payment system.', timestamp: '2026-04-10 10:30', isOwn: true },
  { id: '3', sender: 'Admin', content: 'The refund has been reprocessed. It should appear in your account within 2 business days.', timestamp: '2026-04-10 11:00', isOwn: true },
]

export const Default: StoryObj = {
  render: () => (
    <PortalShell portal="admin" activeNav="Inquiries">
      <div style={{ maxWidth: '800px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <Icon name="message" size={24} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Service Inquiry Reply</h1>
          <InquiryStatusBadge status="対応中" />
        </div>
        <InquiryThread messages={sampleMessages} onSend={() => {}} />
      </div>
    </PortalShell>
  ),
}
