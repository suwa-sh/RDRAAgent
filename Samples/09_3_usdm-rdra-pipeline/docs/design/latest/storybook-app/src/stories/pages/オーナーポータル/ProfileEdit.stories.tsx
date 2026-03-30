import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { PortalShell } from '../../../components/layout/PortalShell'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { Icon } from '../../../components/ui/Icon'

const meta: Meta = { title: 'Pages/オーナーポータル/プロフィール編集' }
export default meta

export const Default: StoryObj = {
  render: () => (
    <PortalShell portal="owner" activeNav="Profile">
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>Edit Profile</h1>
      <div style={{ maxWidth: '640px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="user" size={40} />
            </div>
            <Button variant="outline" size="sm">Change Photo</Button>
          </div>
          <Input label="Company / Individual Name" defaultValue="ABC Corporation" />
          <Input label="Representative Name" defaultValue="Taro Yamada" />
          <Input label="Email" type="email" defaultValue="owner@example.com" />
          <Input label="Phone" type="tel" defaultValue="03-1234-5678" />
          <Input label="Address" defaultValue="1-2-3 Shibuya, Shibuya-ku, Tokyo" />
          <Input label="Introduction" placeholder="Tell users about yourself and your rooms..." />
          <Button size="lg">Save Changes</Button>
        </div>
      </div>
    </PortalShell>
  ),
}
