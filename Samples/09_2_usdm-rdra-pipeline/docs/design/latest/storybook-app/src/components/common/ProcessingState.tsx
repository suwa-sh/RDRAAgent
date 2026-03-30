import React from 'react'

export interface ProcessingStateProps {
  title: string
  progress?: number
  description?: string
}

export const ProcessingState: React.FC<ProcessingStateProps> = ({
  title,
  progress,
  description,
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
        className="animate-spin rounded-full"
        style={{
          width: '3rem',
          height: '3rem',
          border: '3px solid var(--border)',
          borderTopColor: 'var(--primary)',
          marginBottom: 'var(--spacing-4)',
        }}
      />
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
            marginBottom: progress !== undefined ? 'var(--spacing-4)' : '0',
          }}
        >
          {description}
        </p>
      )}
      {progress !== undefined && (
        <div
          style={{
            width: '16rem',
            height: '0.5rem',
            backgroundColor: 'var(--muted)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              backgroundColor: 'var(--primary)',
              borderRadius: 'var(--radius-full)',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      )}
    </div>
  )
}
