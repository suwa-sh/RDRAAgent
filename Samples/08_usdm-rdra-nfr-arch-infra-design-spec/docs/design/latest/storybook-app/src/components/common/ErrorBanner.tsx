import React from 'react'
import { Button } from '@/components/ui/Button'

export type ErrorBannerVariant = 'error' | 'warning' | 'info'

export interface ErrorBannerProps {
  variant?: ErrorBannerVariant
  title: string
  description?: string
  onDismiss?: () => void
  action?: {
    label: string
    onClick: () => void
  }
}

const variantConfig: Record<ErrorBannerVariant, {
  bg: string
  borderColor: string
  iconColor: string
  titleColor: string
  icon: React.ReactNode
}> = {
  error: {
    bg: 'var(--destructive-light)',
    borderColor: 'var(--color-red-100)',
    iconColor: 'var(--destructive)',
    titleColor: 'var(--color-red-700)',
    icon: (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
  warning: {
    bg: 'var(--warning-light)',
    borderColor: 'var(--color-orange-500)',
    iconColor: 'var(--warning)',
    titleColor: 'var(--color-orange-600)',
    icon: (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  info: {
    bg: 'var(--info-light)',
    borderColor: 'var(--color-blue-200)',
    iconColor: 'var(--info)',
    titleColor: 'var(--color-blue-700)',
    icon: (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  },
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  variant = 'error',
  title,
  description,
  onDismiss,
  action,
}) => {
  const config = variantConfig[variant]

  return (
    <div
      role="alert"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 'var(--space-3)',
        padding: 'var(--space-4)',
        background: config.bg,
        border: `1px solid ${config.borderColor}`,
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <span style={{ color: config.iconColor, flexShrink: 0, marginTop: 1 }}>{config.icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-semibold)',
            color: config.titleColor,
            marginBottom: description ? 'var(--space-1)' : '0',
          }}
        >
          {title}
        </p>
        {description && (
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)', lineHeight: 'var(--leading-normal)' }}>
            {description}
          </p>
        )}
        {action && (
          <div style={{ marginTop: 'var(--space-3)' }}>
            <Button variant="outline" size="sm" onClick={action.onClick}>
              {action.label}
            </Button>
          </div>
        )}
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="閉じる"
          style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 24,
            height: 24,
            borderRadius: 'var(--radius-sm)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--foreground-secondary)',
            padding: 0,
          }}
        >
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  )
}
