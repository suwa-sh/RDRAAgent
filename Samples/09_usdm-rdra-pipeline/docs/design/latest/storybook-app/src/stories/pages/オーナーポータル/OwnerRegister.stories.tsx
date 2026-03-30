import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { PortalShell } from '../../../components/layout/PortalShell'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { Icon } from '../../../components/ui/Icon'

const meta: Meta = { title: 'Pages/オーナーポータル/オーナー登録' }
export default meta

export const Default: StoryObj = {
  render: () => (
    <PortalShell portal="owner" activeNav="Profile">
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>Owner Registration</h1>
      <div style={{ maxWidth: '640px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input label="Company / Individual Name *" placeholder="ABC Corporation" />
          <Input label="Representative Name *" placeholder="Taro Yamada" />
          <Input label="Email *" type="email" placeholder="owner@example.com" />
          <Input label="Phone *" type="tel" placeholder="03-1234-5678" />
          <Input label="Address *" placeholder="1-2-3 Shibuya, Shibuya-ku, Tokyo" />
          <div style={{ padding: '12px', backgroundColor: 'var(--info-light)', borderRadius: '8px' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--info)' }}>
              <Icon name="shield-check" size={16} /> Your information will be reviewed by our team within 3 business days.
            </p>
          </div>
          <Button size="lg">Register</Button>
        </div>
      </div>
    </PortalShell>
  ),
}
