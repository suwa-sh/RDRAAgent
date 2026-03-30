import React from 'react'
import { Card } from '../ui/Card'
import { Icon } from '../ui/Icon'
import { StarRating } from './StarRating'
import { PriceDisplay } from './PriceDisplay'

export interface RoomCardProps {
  roomName: string
  location: string
  price: number
  rating: number
  capacity: number
  imageUrl?: string
}

export const RoomCard: React.FC<RoomCardProps> = ({
  roomName,
  location,
  price,
  rating,
  capacity,
  imageUrl,
}) => {
  return (
    <Card hoverable style={{ padding: 0, overflow: 'hidden', maxWidth: '20rem' }}>
      {/* Image placeholder */}
      <div
        style={{
          height: '10rem',
          backgroundColor: 'var(--muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {imageUrl ? (
          <img src={imageUrl} alt={roomName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <Icon name="room" size={48} />
        )}
      </div>
      {/* Content */}
      <div style={{ padding: 'var(--spacing-4)' }}>
        <h3
          style={{
            fontSize: 'var(--text-base)',
            fontWeight: 'var(--font-semibold)',
            color: 'var(--foreground)',
            marginBottom: 'var(--spacing-1)',
          }}
        >
          {roomName}
        </h3>
        <div
          className="inline-flex items-center gap-1"
          style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--foreground-secondary)',
            marginBottom: 'var(--spacing-2)',
          }}
        >
          <Icon name="map-pin" size={14} />
          {location}
        </div>
        <div
          className="flex items-center gap-1"
          style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--foreground-secondary)',
            marginBottom: 'var(--spacing-2)',
          }}
        >
          <Icon name="users" size={14} />
          <span>{capacity}名</span>
        </div>
        <div className="flex items-center justify-between" style={{ marginTop: 'var(--spacing-2)' }}>
          <StarRating value={rating} readonly size={16} />
          <PriceDisplay amount={price} size="sm" />
        </div>
      </div>
    </Card>
  )
}
