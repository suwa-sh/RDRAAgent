import React from 'react'
import { Badge, type BadgeProps } from '../ui/Badge'

export interface ReservationStatusBadgeProps {
  status: '仮予約' | '確定' | '変更中' | '利用中' | '利用完了' | '取消'
}

const statusVariantMap: Record<string, BadgeProps['variant']> = {
  '仮予約': 'warning',
  '確定': 'success',
  '変更中': 'info',
  '利用中': 'default',
  '利用完了': 'success',
  '取消': 'destructive',
}

export const ReservationStatusBadge: React.FC<ReservationStatusBadgeProps> = ({ status }) => (
  <Badge variant={statusVariantMap[status] || 'outline'}>{status}</Badge>
)
