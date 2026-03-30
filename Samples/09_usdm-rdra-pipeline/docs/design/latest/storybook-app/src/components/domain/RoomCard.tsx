import React from 'react'
import { Card } from '../ui/Card'
import { Icon } from '../ui/Icon'
import { StarRating } from './StarRating'
import { PriceDisplay } from './PriceDisplay'
import { Badge } from '../ui/Badge'

export interface RoomCardProps {
  name: string
  area: string
  price: number
  rating: number
  imageUrl?: string
  location: string
  available?: boolean
  variant?: 'compact' | 'detailed'
}

export const RoomCard: React.FC<RoomCardProps> = ({
  name,
  area,
  price,
  rating,
  imageUrl,
  location,
  available = true,
  variant = 'compact',
}) => (
  <Card hoverable>
    <div className={variant === 'detailed' ? 'flex gap-4' : ''}>
      <div
        className={`rounded-lg flex items-center justify-center ${variant === 'detailed' ? 'w-48 h-32 flex-shrink-0' : 'w-full h-40 mb-3'}`}
        style={{ backgroundColor: 'var(--muted)' }}
      >
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover rounded-lg" />
        ) : (
          <Icon name="room" size={48} className="opacity-30" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold truncate" style={{ color: 'var(--foreground)' }}>{name}</h3>
          <Badge variant={available ? 'success' : 'destructive'}>
            {available ? '貸出可' : '貸出不可'}
          </Badge>
        </div>
        <div className="flex items-center gap-1 mb-1 text-sm" style={{ color: 'var(--muted-foreground)' }}>
          <Icon name="map-pin" size={14} />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-1 mb-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
          <Icon name="users" size={14} />
          <span>{area}</span>
        </div>
        <div className="flex items-center justify-between">
          <StarRating value={rating} readonly size={16} />
          <PriceDisplay amount={price} size="md" />
        </div>
      </div>
    </div>
  </Card>
)
