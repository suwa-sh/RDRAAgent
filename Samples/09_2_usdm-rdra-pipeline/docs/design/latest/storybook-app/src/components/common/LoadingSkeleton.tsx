import React from 'react'

export interface LoadingSkeletonProps {
  variant?: 'card' | 'table' | 'form' | 'list'
  count?: number
}

const SkeletonLine: React.FC<{ width?: string; height?: string }> = ({
  width = '100%',
  height = '1rem',
}) => (
  <div
    className="rounded-md animate-pulse"
    style={{
      width,
      height,
      backgroundColor: 'var(--muted)',
    }}
  />
)

const SkeletonCard: React.FC = () => (
  <div
    style={{
      backgroundColor: 'var(--card-bg)',
      border: '1px solid var(--card-border)',
      borderRadius: 'var(--card-radius)',
      padding: 'var(--card-padding)',
    }}
  >
    <SkeletonLine height="10rem" />
    <div className="flex flex-col gap-2" style={{ marginTop: 'var(--spacing-3)' }}>
      <SkeletonLine width="60%" />
      <SkeletonLine width="40%" />
      <SkeletonLine width="80%" />
    </div>
  </div>
)

const SkeletonTableRow: React.FC = () => (
  <div className="flex gap-4" style={{ padding: 'var(--spacing-3) 0', borderBottom: '1px solid var(--border)' }}>
    <SkeletonLine width="20%" />
    <SkeletonLine width="30%" />
    <SkeletonLine width="25%" />
    <SkeletonLine width="15%" />
  </div>
)

const SkeletonForm: React.FC = () => (
  <div className="flex flex-col gap-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex flex-col gap-1.5">
        <SkeletonLine width="6rem" height="0.875rem" />
        <SkeletonLine height="2.5rem" />
      </div>
    ))}
    <SkeletonLine width="8rem" height="2.5rem" />
  </div>
)

const SkeletonListItem: React.FC = () => (
  <div className="flex items-center gap-3" style={{ padding: 'var(--spacing-3) 0', borderBottom: '1px solid var(--border)' }}>
    <SkeletonLine width="2.5rem" height="2.5rem" />
    <div className="flex flex-col gap-1 flex-1">
      <SkeletonLine width="50%" />
      <SkeletonLine width="30%" height="0.75rem" />
    </div>
  </div>
)

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'card',
  count = 3,
}) => {
  const items = Array.from({ length: count }, (_, i) => i)

  if (variant === 'card') {
    return (
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(16rem, 1fr))' }}>
        {items.map((i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  if (variant === 'table') {
    return (
      <div>
        <div className="flex gap-4" style={{ padding: 'var(--spacing-3) 0', borderBottom: '2px solid var(--border)' }}>
          <SkeletonLine width="20%" height="0.875rem" />
          <SkeletonLine width="30%" height="0.875rem" />
          <SkeletonLine width="25%" height="0.875rem" />
          <SkeletonLine width="15%" height="0.875rem" />
        </div>
        {items.map((i) => <SkeletonTableRow key={i} />)}
      </div>
    )
  }

  if (variant === 'form') {
    return <SkeletonForm />
  }

  return (
    <div>
      {items.map((i) => <SkeletonListItem key={i} />)}
    </div>
  )
}
