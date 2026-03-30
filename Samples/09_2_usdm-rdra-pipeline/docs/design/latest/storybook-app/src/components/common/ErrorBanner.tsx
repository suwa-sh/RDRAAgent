import React from 'react'
import { Icon } from '../ui/Icon'

export interface ErrorBannerProps {
  message: string
  type?: 'error' | 'warning'
  onDismiss?: () => void
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  message,
  type = 'error',
  onDismiss,
}) => {
  const isError = type === 'error'
  return (
    <div
      className="flex items-center gap-3 rounded-md"
      style={{
        padding: 'var(--spacing-3) var(--spacing-4)',
        backgroundColor: isError ? 'var(--destructive-light)' : 'var(--warning-light)',
        border: `1px solid ${isError ? 'var(--destructive)' : 'var(--warning)'}`,
      }}
    >
      <Icon name={isError ? 'shield-check' : 'clock'} size={18} />
      <span
        className="flex-1"
        style={{
          fontSize: 'var(--text-sm)',
          color: isError ? 'var(--destructive)' : 'var(--warning)',
        }}
      >
        {message}
      </span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="cursor-pointer"
          style={{
            background: 'none',
            border: 'none',
            padding: '0.25rem',
            color: isError ? 'var(--destructive)' : 'var(--warning)',
          }}
        >
          <Icon name="x" size={16} />
        </button>
      )}
    </div>
  )
}
