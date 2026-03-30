import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { PortalShell } from '../../../components/layout/PortalShell'
import { InquiryThread } from '../../../components/domain/InquiryThread'
import { InquiryStatusBadge } from '../../../components/domain/InquiryStatusBadge'
import { Icon } from '../../../components/ui/Icon'

const meta: Meta = { title: 'Pages/利用者ポータル/サービス問合せ' }
export default meta

const sampleMessages = [
  { id: '1', sender: 'You', content: 'I have a question about the payment process. How long does the refund take?', timestamp: '2026-04-10 09:00', isOwn: true },
  { id: '2', sender: 'Support', content: 'Refunds are processed within 3-5 business days after cancellation.', timestamp: '2026-04-10 10:30', isOwn: false },
]

export const Default: StoryObj = {
  render: () => (
    <PortalShell portal="user" activeNav="Support">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <Icon name="message" size={24} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Service Support</h1>
          <InquiryStatusBadge status="回答済" />
        </div>
        <InquiryThread messages={sampleMessages} onSend={() => {}} />
      </div>
    </PortalShell>
  ),
}
