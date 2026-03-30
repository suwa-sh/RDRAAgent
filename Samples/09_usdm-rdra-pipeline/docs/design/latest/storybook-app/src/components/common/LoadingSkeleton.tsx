import React from 'react'

export interface LoadingSkeletonProps {
  variant?: 'card' | 'table' | 'form' | 'detail'
  count?: number
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ variant = 'card', count = 3 }) => {
  const skeletonStyle: React.CSSProperties = {
    backgroundColor: 'var(--muted)',
    borderRadius: '8px',
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  }
  if (variant === 'card') {
    return (
      <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} style={{ ...skeletonStyle, height: '200px' }} />
        ))}
      </div>
    )
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ ...skeletonStyle, height: '48px' }} />
      ))}
    </div>
  )
}
