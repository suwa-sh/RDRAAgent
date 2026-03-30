import React from 'react'
import { Badge, type BadgeProps } from '../ui/Badge'

export interface InquiryStatusBadgeProps {
  status: '受付' | '対応中' | '回答済' | '完了'
}

const statusVariantMap: Record<string, BadgeProps['variant']> = {
  '受付': 'info',
  '対応中': 'warning',
  '回答済': 'success',
  '完了': 'outline',
}

export const InquiryStatusBadge: React.FC<InquiryStatusBadgeProps> = ({ status }) => (
  <Badge variant={statusVariantMap[status] || 'outline'}>{status}</Badge>
)
