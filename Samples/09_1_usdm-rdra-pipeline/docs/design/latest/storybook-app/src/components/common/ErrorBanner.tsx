import React from 'react'

export interface ErrorBannerProps {
  message: string
  onRetry?: () => void
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onRetry }) => {
  return (
    <div
      className="flex items-center justify-between rounded-lg px-4 py-3"
      style={{
        backgroundColor: 'var(--destructive-light, rgba(220, 38, 38, 0.1))',
        border: '1px solid var(--destructive)',
        color: 'var(--destructive)',
      }}
    >
      <div className="flex items-center gap-2">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span className="text-sm font-medium">{message}</span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm font-medium underline"
          style={{ color: 'var(--destructive)' }}
        >
          再試行
        </button>
      )}
    </div>
  )
}
