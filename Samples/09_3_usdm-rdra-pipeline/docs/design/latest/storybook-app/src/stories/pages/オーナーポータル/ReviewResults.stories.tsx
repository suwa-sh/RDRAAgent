import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { PortalShell } from '../../../components/layout/PortalShell'
import { StarRating } from '../../../components/domain/StarRating'
import { Card } from '../../../components/ui/Card'
import { Icon } from '../../../components/ui/Icon'

const meta: Meta = { title: 'Pages/オーナーポータル/評価結果一覧' }
export default meta

const rooms = [
  { name: 'Sakura Room', rating: 4.5, reviewCount: 12 },
  { name: 'Fuji Room', rating: 4.2, reviewCount: 8 },
  { name: 'Zen Room', rating: 4.8, reviewCount: 5 },
]

export const Default: StoryObj = {
  render: () => (
    <PortalShell portal="owner" activeNav="Reviews">
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>Review Results</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {rooms.map((r, i) => (
          <Card key={i} hoverable>
            <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Icon name="room" size={24} />
                <div>
                  <div style={{ fontWeight: 600 }}>{r.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{r.reviewCount} reviews</div>
                </div>
              </div>
              <StarRating value={r.rating} readonly size={20} />
            </div>
          </Card>
        ))}
      </div>
    </PortalShell>
  ),
}
