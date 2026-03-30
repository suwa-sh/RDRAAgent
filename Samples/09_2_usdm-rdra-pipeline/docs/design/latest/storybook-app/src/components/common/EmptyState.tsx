import React from 'react'
import { Icon } from '../ui/Icon'
import { Button, ButtonProps } from '../ui/Button'

export interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  action?: {
    label: string
    onClick?: () => void
    variant?: ButtonProps['variant']
  }
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'search',
  title,
  description,
  action,
}) => {
  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{
        padding: 'var(--spacing-12)',
        textAlign: 'center',
      }}
    >
      <div
        className="flex items-center justify-center rounded-full"
        style={{
          width: '4rem',
          height: '4rem',
          backgroundColor: 'var(--muted)',
          marginBottom: 'var(--spacing-4)',
        }}
      >
        <Icon name={icon} size={32} />
      </div>
      <h3
        style={{
          fontSize: 'var(--text-lg)',
          fontWeight: 'var(--font-semibold)',
          color: 'var(--foreground)',
          marginBottom: 'var(--spacing-2)',
        }}
      >
        {title}
      </h3>
      {description && (
        <p
          style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--foreground-secondary)',
            maxWidth: '24rem',
            marginBottom: action ? 'var(--spacing-4)' : '0',
          }}
        >
          {description}
        </p>
      )}
      {action && (
        <Button variant={action.variant || 'default'} onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}
