import React from 'react'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Icon } from '../ui/Icon'
import { StarRating } from './StarRating'
import { PriceDisplay } from './PriceDisplay'

export interface RoomCardProps {
  name: string
  variant: 'physical' | 'virtual'
  imageUrl?: string
  location?: string
  toolType?: string
  rating: number
  reviewCount: number
  capacity: number
  pricePerHour: number
  onBook?: () => void
}

export const RoomCard: React.FC<RoomCardProps> = ({
  name,
  variant,
  imageUrl,
  location,
  toolType,
  rating,
  reviewCount,
  capacity,
  pricePerHour,
  onBook,
}) => (
  <Card hoverable className="flex flex-col overflow-hidden p-0">
    <div
      className="relative w-full bg-[var(--muted)]"
      style={{ height: 'var(--room-card-image-height)' }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
          style={{ borderRadius: 'var(--room-card-image-radius) var(--room-card-image-radius) 0 0' }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Icon name={variant === 'virtual' ? 'virtual-room' : 'room'} size={48} />
        </div>
      )}
      <div className="absolute top-[var(--space-3)] left-[var(--space-3)]">
        <Badge variant={variant === 'virtual' ? 'virtual' : 'info'}>
          {variant === 'virtual' ? 'バーチャル' : '物理'}
        </Badge>
      </div>
    </div>

    <div className="flex flex-col gap-[var(--space-2)] p-[var(--card-padding)]">
      <h3 className="text-[var(--text-lg)] font-[var(--font-semibold)] truncate" style={{ color: 'var(--foreground)' }}>
        {name}
      </h3>

      <div className="flex items-center gap-[var(--space-1)] text-[var(--text-sm)]" style={{ color: 'var(--foreground-secondary)' }}>
        {variant === 'virtual' ? (
          <><Icon name="virtual-room" size={16} /><span>{toolType}</span></>
        ) : (
          <><Icon name="map-pin" size={16} /><span>{location}</span></>
        )}
      </div>

      <StarRating value={rating} count={reviewCount} size="sm" />

      <div className="flex items-center gap-[var(--space-1)] text-[var(--text-sm)]" style={{ color: 'var(--foreground-secondary)' }}>
        <Icon name="users" size={16} /> 収容人数: {capacity}名
      </div>

      <div className="flex items-center justify-between mt-[var(--space-2)]">
        <PriceDisplay amount={pricePerHour} size="md" />
        <Button size="sm" onClick={onBook}>予約する</Button>
      </div>
    </div>
  </Card>
)
