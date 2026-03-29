import React from 'react'
import { Badge, type BadgeVariant } from '../ui/Badge'

export type ReservationStatus = 'pending' | 'approved' | 'in-use' | 'completed' | 'cancelled' | 'rejected'

export interface ReservationStatusBadgeProps {
  status: ReservationStatus
}

const statusConfig: Record<ReservationStatus, { label: string; variant: BadgeVariant }> = {
  pending:   { label: '申請中', variant: 'warning' },
  approved:  { label: '確定',   variant: 'success' },
  'in-use':  { label: '利用中', variant: 'info' },
  completed: { label: '完了',   variant: 'default' },
  cancelled: { label: '取消',   variant: 'destructive' },
  rejected:  { label: '拒否',   variant: 'destructive' },
}

export const ReservationStatusBadge: React.FC<ReservationStatusBadgeProps> = ({ status }) => {
  const { label, variant } = statusConfig[status]
  return <Badge variant={variant}>{label}</Badge>
}
