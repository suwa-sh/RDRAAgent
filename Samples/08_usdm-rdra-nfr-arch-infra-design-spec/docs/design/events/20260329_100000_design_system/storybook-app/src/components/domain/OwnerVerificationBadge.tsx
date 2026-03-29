import React from 'react'
import { Badge, type BadgeVariant } from '../ui/Badge'

export type OwnerStatus = 'unverified' | 'under-review' | 'verified' | 'rejected' | 'withdrawn'

export interface OwnerVerificationBadgeProps {
  status: OwnerStatus
}

const StatusIcon: React.FC<{ status: OwnerStatus }> = ({ status }) => {
  const size = 12
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  switch (status) {
    case 'unverified':
      return <svg {...props}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
    case 'under-review':
      return <svg {...props}><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
    case 'verified':
      return <svg {...props}><polyline points="20 6 9 17 4 12"/></svg>
    case 'rejected':
      return <svg {...props}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    case 'withdrawn':
      return <svg {...props}><line x1="5" y1="12" x2="19" y2="12"/></svg>
  }
}

const statusConfig: Record<OwnerStatus, { label: string; variant: BadgeVariant }> = {
  unverified:     { label: '未審査', variant: 'outline' },
  'under-review': { label: '審査中', variant: 'warning' },
  verified:       { label: '認証済', variant: 'success' },
  rejected:       { label: '却下',   variant: 'destructive' },
  withdrawn:      { label: '退会',   variant: 'outline' },
}

export const OwnerVerificationBadge: React.FC<OwnerVerificationBadgeProps> = ({ status }) => {
  const { label, variant } = statusConfig[status]
  return (
    <Badge variant={variant}>
      <span className="mr-[var(--space-1)] inline-flex"><StatusIcon status={status} /></span>
      {label}
    </Badge>
  )
}
