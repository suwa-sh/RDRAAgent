import React from 'react'
import { Badge } from '../ui/Badge'

export interface ReservationStatusBadgeProps {
  status: '仮予約' | '予約確定' | '変更中' | '取消済' | '完了'
}

const statusMap: Record<string, { variant: 'default' | 'success' | 'warning' | 'destructive' | 'info' | 'outline'; label: string }> = {
  '仮予約': { variant: 'warning', label: '仮予約' },
  '予約確定': { variant: 'success', label: '予約確定' },
  '変更中': { variant: 'info', label: '変更中' },
  '取消済': { variant: 'outline', label: '取消済' },
  '完了': { variant: 'default', label: '完了' },
}

export const ReservationStatusBadge: React.FC<ReservationStatusBadgeProps> = ({ status }) => {
  const config = statusMap[status] || statusMap['仮予約']
  return <Badge variant={config.variant}>{config.label}</Badge>
}
