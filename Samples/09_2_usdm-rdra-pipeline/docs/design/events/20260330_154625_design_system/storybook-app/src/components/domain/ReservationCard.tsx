import React from 'react'
import { Card } from '../ui/Card'
import { Icon } from '../ui/Icon'
import { StatusBadge } from './StatusBadge'

export interface ReservationCardProps {
  reservationId: string
  roomName: string
  dateTime: string
  status: string
  userName?: string
}

export const ReservationCard: React.FC<ReservationCardProps> = ({
  reservationId,
  roomName,
  dateTime,
  status,
  userName,
}) => {
  return (
    <Card hoverable>
      <div className="flex items-start justify-between" style={{ marginBottom: 'var(--spacing-3)' }}>
        <div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground-secondary)' }}>
            {reservationId}
          </div>
          <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--foreground)' }}>
            {roomName}
          </h3>
        </div>
        <StatusBadge status={status} model="reservation" />
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="inline-flex items-center gap-1.5" style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)' }}>
          <Icon name="calendar" size={14} />
          <span>{dateTime}</span>
        </div>
        {userName && (
          <div className="inline-flex items-center gap-1.5" style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)' }}>
            <Icon name="user" size={14} />
            <span>{userName}</span>
          </div>
        )}
      </div>
    </Card>
  )
}
