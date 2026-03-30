import React from 'react'

export interface LoadingSkeletonProps {
  variant?: 'card' | 'table' | 'form'
  count?: number
}

const SkeletonLine: React.FC<{ width?: string; height?: string }> = ({
  width = '100%',
  height = '1rem',
}) => (
  <div
    className="rounded animate-pulse"
    style={{
      width,
      height,
      backgroundColor: 'var(--muted)',
    }}
  />
)

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'card',
  count = 3,
}) => {
  if (variant === 'card') {
    return (
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg p-6"
            style={{
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
            }}
          >
            <SkeletonLine height="10rem" />
            <div className="mt-4 space-y-2">
              <SkeletonLine width="70%" />
              <SkeletonLine width="50%" />
              <SkeletonLine width="30%" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'table') {
    return (
      <div className="space-y-2">
        <SkeletonLine height="2.5rem" />
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonLine key={i} height="3rem" />
        ))}
      </div>
    )
  }

  // form
  return (
    <div className="space-y-4" style={{ maxWidth: '32rem' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-1">
          <SkeletonLine width="6rem" height="0.875rem" />
          <SkeletonLine height="2.5rem" />
        </div>
      ))}
      <SkeletonLine width="8rem" height="2.5rem" />
    </div>
  )
}
