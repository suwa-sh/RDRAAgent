import React from 'react'
import { Badge } from '../ui/Badge'

export interface KeyStatusBadgeProps {
  status: '貸出中' | '返却済'
}

const statusMap: Record<string, { variant: 'warning' | 'success'; label: string }> = {
  '貸出中': { variant: 'warning', label: '貸出中' },
  '返却済': { variant: 'success', label: '返却済' },
}

export const KeyStatusBadge: React.FC<KeyStatusBadgeProps> = ({ status }) => {
  const config = statusMap[status] || statusMap['貸出中']
  return <Badge variant={config.variant}>{config.label}</Badge>
}
