import React from 'react'
import { Badge, type BadgeProps } from '../ui/Badge'

export interface OwnerStatusBadgeProps {
  status: '未申請' | '申請中' | '審査中' | '承認' | '却下' | '退会'
}

const statusVariantMap: Record<string, BadgeProps['variant']> = {
  '未申請': 'outline',
  '申請中': 'info',
  '審査中': 'warning',
  '承認': 'success',
  '却下': 'destructive',
  '退会': 'outline',
}

export const OwnerStatusBadge: React.FC<OwnerStatusBadgeProps> = ({ status }) => (
  <Badge variant={statusVariantMap[status] || 'outline'}>{status}</Badge>
)
