import React from 'react'

export interface EmptyStateProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, action }) => (
  <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--muted-foreground)' }}>
    <p style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '8px' }}>{title}</p>
    {description && <p style={{ fontSize: '0.875rem', marginBottom: '16px' }}>{description}</p>}
    {action && <div>{action}</div>}
  </div>
)
