import React from 'react'
import { Button } from '@/components/ui/Button'

export type ProcessingStatus = 'processing' | 'completed' | 'failed'

export interface ProcessingStateProps {
  status: ProcessingStatus
  title: string
  description?: string
  onRetry?: () => void
}

const SpinnerIcon: React.FC = () => (
  <svg
    className="animate-spin"
    width={32}
    height={32}
    viewBox="0 0 24 24"
    fill="none"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
)

const CheckIcon: React.FC = () => (
  <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
)

const ErrorIcon: React.FC = () => (
  <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
)

const statusConfig: Record<ProcessingStatus, {
  icon: React.ReactNode
  iconColor: string
  titleColor: string
}> = {
  processing: {
    icon: <SpinnerIcon />,
    iconColor: 'var(--primary)',
    titleColor: 'var(--foreground)',
  },
  completed: {
    icon: <CheckIcon />,
    iconColor: 'var(--success)',
    titleColor: 'var(--foreground)',
  },
  failed: {
    icon: <ErrorIcon />,
    iconColor: 'var(--destructive)',
    titleColor: 'var(--foreground)',
  },
}

export const ProcessingState: React.FC<ProcessingStateProps> = ({
  status,
  title,
  description,
  onRetry,
}) => {
  const config = statusConfig[status]

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px var(--space-6)',
        textAlign: 'center',
        gap: 'var(--space-4)',
      }}
    >
      <span style={{ color: config.iconColor }}>{config.icon}</span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <p
          style={{
            fontSize: 'var(--text-base)',
            fontWeight: 'var(--font-semibold)',
            color: config.titleColor,
          }}
        >
          {title}
        </p>
        {description && (
          <p
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--foreground-secondary)',
              lineHeight: 'var(--leading-relaxed)',
              maxWidth: 360,
            }}
          >
            {description}
          </p>
        )}
      </div>
      {status === 'failed' && onRetry && (
        <Button variant="outline" size="md" onClick={onRetry}>
          再試行
        </Button>
      )}
    </div>
  )
}
