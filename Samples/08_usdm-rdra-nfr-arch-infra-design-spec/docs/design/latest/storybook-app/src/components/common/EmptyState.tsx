import React from 'react'
import { Button } from '@/components/ui/Button'

export interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px var(--space-6)',
      textAlign: 'center',
    }}
  >
    {icon && (
      <div
        style={{
          marginBottom: 'var(--space-4)',
          color: 'var(--foreground-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </div>
    )}
    <p
      style={{
        fontSize: 'var(--text-base)',
        fontWeight: 'var(--font-semibold)',
        color: 'var(--foreground)',
        marginBottom: description ? 'var(--space-2)' : '0',
      }}
    >
      {title}
    </p>
    {description && (
      <p
        style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--foreground-secondary)',
          marginBottom: action ? 'var(--space-5)' : '0',
          maxWidth: 360,
          lineHeight: 'var(--leading-relaxed)',
        }}
      >
        {description}
      </p>
    )}
    {action && (
      <Button variant="default" size="md" onClick={action.onClick}>
        {action.label}
      </Button>
    )}
  </div>
)
