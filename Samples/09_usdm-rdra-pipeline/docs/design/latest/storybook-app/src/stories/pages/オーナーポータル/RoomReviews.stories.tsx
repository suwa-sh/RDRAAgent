import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { PortalShell } from '../../../components/layout/PortalShell'
import { StarRating } from '../../../components/domain/StarRating'
import { Card } from '../../../components/ui/Card'
import { Icon } from '../../../components/ui/Icon'

const meta: Meta = { title: 'Pages/オーナーポータル/会議室評価確認' }
export default meta

const reviews = [
  { user: 'User A', rating: 5, comment: 'Excellent room with great facilities. Will book again.', date: '2026-04-10' },
  { user: 'User B', rating: 4, comment: 'Clean and well-maintained. Location is convenient.', date: '2026-04-08' },
  { user: 'User C', rating: 3, comment: 'Decent but the projector was outdated.', date: '2026-04-05' },
]

export const Default: StoryObj = {
  render: () => (
    <PortalShell portal="owner" activeNav="Reviews">
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Room Reviews</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
        <Icon name="room" size={20} />
        <span style={{ fontWeight: 500 }}>Sakura Room</span>
        <span style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>Average: </span>
        <StarRating value={4.0} readonly />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {reviews.map((r, i) => (
          <Card key={i}>
            <div style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Icon name="user" size={16} /> {r.user}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{r.date}</span>
              </div>
              <StarRating value={r.rating} readonly size={16} />
              <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginTop: '8px' }}>{r.comment}</p>
            </div>
          </Card>
        ))}
      </div>
    </PortalShell>
  ),
}
