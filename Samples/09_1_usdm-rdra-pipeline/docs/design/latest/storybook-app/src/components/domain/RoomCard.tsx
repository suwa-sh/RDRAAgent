import React from 'react'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Icon } from '../ui/Icon'
import { StarRating } from './StarRating'
import { PriceDisplay } from './PriceDisplay'

export interface RoomCardProps {
  roomName: string
  price: number
  rating: number
  features: string[]
  address: string
  capacity: number
  variant?: 'grid' | 'list'
}

export const RoomCard: React.FC<RoomCardProps> = ({
  roomName,
  price,
  rating,
  features,
  address,
  capacity,
  variant = 'grid',
}) => {
  if (variant === 'list') {
    return (
      <Card hoverable>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {/* Placeholder image */}
          <div
            style={{
              width: '120px',
              height: '80px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon name="room" size={32} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '0.25rem' }}>
              {roomName}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--foreground-secondary)', marginBottom: '0.25rem' }}>
              <Icon name="map-pin" size={14} />
              <span>{address}</span>
              <Icon name="users" size={14} />
              <span>{capacity}名</span>
            </div>
            <StarRating value={rating} readonly size={14} />
          </div>
          <PriceDisplay amount={price} suffix="/時間" />
        </div>
      </Card>
    )
  }

  return (
    <Card hoverable>
      {/* Placeholder image */}
      <div
        style={{
          width: '100%',
          height: '160px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--muted)',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon name="room" size={48} />
      </div>
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '0.5rem' }}>
        {roomName}
      </h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--foreground-secondary)', marginBottom: '0.5rem' }}>
        <Icon name="map-pin" size={14} />
        <span>{address}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--foreground-secondary)', marginBottom: '0.75rem' }}>
        <Icon name="users" size={14} />
        <span>最大{capacity}名</span>
      </div>
      <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        {features.map((f) => (
          <Badge key={f} variant="outline">{f}</Badge>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <StarRating value={rating} readonly size={16} />
        <PriceDisplay amount={price} suffix="/時間" />
      </div>
    </Card>
  )
}
