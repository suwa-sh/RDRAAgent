import React from 'react'
import { Badge } from '../ui/Badge'

export interface StatusBadgeProps {
  status: string
  model?: 'owner' | 'reservation' | 'key' | 'room-usage' | 'room'
}

type BadgeVariant = 'default' | 'success' | 'warning' | 'destructive' | 'info' | 'outline'

const stateColorMap: Record<string, BadgeVariant> = {
  // Owner states
  '未登録': 'outline',
  '申請中': 'info',
  '審査中': 'warning',
  '承認済': 'success',
  '却下': 'destructive',
  '退会': 'outline',
  // Reservation states
  '予約申請中': 'info',
  '予約確定': 'success',
  '変更中': 'warning',
  '取消済': 'destructive',
  '利用済': 'outline',
  // Key states
  '保管中': 'outline',
  '貸出中': 'warning',
  '返却済': 'success',
  // Room usage states
  '利用前': 'outline',
  '利用中': 'info',
  '利用終了': 'success',
  // Room states
  '未公開': 'outline',
  '公開中': 'success',
  '貸出停止': 'destructive',
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const variant = stateColorMap[status] || 'outline'
  return <Badge variant={variant}>{status}</Badge>
}
