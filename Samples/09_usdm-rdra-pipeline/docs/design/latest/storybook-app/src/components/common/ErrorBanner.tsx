import React from 'react'
import { Button } from '../ui/Button'

export interface ErrorBannerProps {
  message: string
  onRetry?: () => void
  dismissible?: boolean
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onRetry, dismissible = true }) => (
  <div style={{
    padding: '12px 16px',
    backgroundColor: 'var(--destructive-light)',
    border: '1px solid var(--destructive)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
  }}>
    <span style={{ color: 'var(--destructive)', fontSize: '0.875rem' }}>{message}</span>
    {onRetry && <Button variant="outline" size="sm" onClick={onRetry}>Retry</Button>}
  </div>
)
