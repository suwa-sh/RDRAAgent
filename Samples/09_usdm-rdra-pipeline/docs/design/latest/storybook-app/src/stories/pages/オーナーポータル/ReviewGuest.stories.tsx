import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { PortalShell } from '../../../components/layout/PortalShell'
import { StarRating } from '../../../components/domain/StarRating'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Icon } from '../../../components/ui/Icon'

const meta: Meta = { title: 'Pages/オーナーポータル/利用者評価' }
export default meta

export const Default: StoryObj = {
  render: () => (
    <PortalShell portal="owner" activeNav="Reviews">
      <div style={{ maxWidth: '640px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>Rate Guest</h1>
        <Card>
          <div style={{ padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Icon name="user" size={20} />
              <span style={{ fontWeight: 600 }}>Guest: Suzuki</span>
              <span style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>- Sakura Room, 2026-04-15</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '8px' }}>Compliance with Rules</label>
                <StarRating value={4} onChange={() => {}} />
              </div>
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '8px' }}>Room Condition After Use</label>
                <StarRating value={5} onChange={() => {}} />
              </div>
              <Input label="Comment" placeholder="How was the guest?" />
              <Button size="lg">Submit Review</Button>
            </div>
          </div>
        </Card>
      </div>
    </PortalShell>
  ),
}
