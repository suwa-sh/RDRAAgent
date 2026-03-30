import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { PortalShell } from '../../../components/layout/PortalShell'
import { StarRating } from '../../../components/domain/StarRating'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Icon } from '../../../components/ui/Icon'

const meta: Meta = { title: 'Pages/利用者ポータル/ホスト評価' }
export default meta

export const Default: StoryObj = {
  render: () => (
    <PortalShell portal="user" activeNav="Reviews">
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>Rate Host</h1>
        <Card>
          <div style={{ padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Icon name="user" size={20} />
              <span style={{ fontWeight: 600 }}>Host: Tanaka</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '8px' }}>Communication</label>
                <StarRating value={5} onChange={() => {}} />
              </div>
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '8px' }}>Responsiveness</label>
                <StarRating value={4} onChange={() => {}} />
              </div>
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '8px' }}>Hospitality</label>
                <StarRating value={5} onChange={() => {}} />
              </div>
              <Input label="Comment" placeholder="How was the host?" />
              <Button size="lg">Submit Review</Button>
            </div>
          </div>
        </Card>
      </div>
    </PortalShell>
  ),
}
