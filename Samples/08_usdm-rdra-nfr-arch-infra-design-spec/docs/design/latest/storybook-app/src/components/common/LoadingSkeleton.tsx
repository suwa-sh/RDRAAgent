import React from 'react'

export type LoadingSkeletonVariant = 'card' | 'table-row' | 'detail' | 'form'

export interface LoadingSkeletonProps {
  variant: LoadingSkeletonVariant
  count?: number
}

const SkeletonBlock: React.FC<{ width?: string; height?: string; radius?: string }> = ({
  width = '100%',
  height = '16px',
  radius = 'var(--radius-md)',
}) => (
  <div
    className="animate-pulse"
    style={{
      width,
      height,
      borderRadius: radius,
      background: 'var(--muted)',
    }}
  />
)

const CardSkeleton: React.FC = () => (
  <div
    style={{
      background: 'var(--card-bg)',
      border: '1px solid var(--card-border)',
      borderRadius: 'var(--card-radius)',
      overflow: 'hidden',
      boxShadow: 'var(--card-shadow)',
    }}
  >
    <SkeletonBlock height="200px" radius="0" />
    <div style={{ padding: 'var(--card-padding)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <SkeletonBlock height="20px" width="70%" />
      <SkeletonBlock height="14px" width="100%" />
      <SkeletonBlock height="14px" width="85%" />
    </div>
  </div>
)

const TableRowSkeleton: React.FC = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-4)',
      padding: 'var(--space-3) var(--table-cell-padding)',
      borderBottom: '1px solid var(--table-border)',
      height: 'var(--table-row-height)',
    }}
  >
    <SkeletonBlock width="120px" height="14px" />
    <SkeletonBlock width="200px" height="14px" />
    <SkeletonBlock width="80px"  height="14px" />
    <SkeletonBlock width="100px" height="14px" />
    <SkeletonBlock width="64px"  height="24px" radius="var(--radius-full)" />
  </div>
)

const DetailSkeleton: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <SkeletonBlock height="28px" width="50%" />
      <SkeletonBlock height="16px" width="30%" />
    </div>
    {[0, 1, 2].map((i) => (
      <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <SkeletonBlock height="14px" width="100%" />
        <SkeletonBlock height="14px" width="92%" />
        <SkeletonBlock height="14px" width="78%" />
      </div>
    ))}
  </div>
)

const FormSkeleton: React.FC<{ count: number }> = ({ count }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1-5)' }}>
        <SkeletonBlock height="14px" width="120px" />
        <SkeletonBlock height="var(--input-height)" radius="var(--input-radius)" />
      </div>
    ))}
  </div>
)

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ variant, count = 3 }) => {
  switch (variant) {
    case 'card':
      return <CardSkeleton />
    case 'table-row':
      return (
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--table-border)', borderRadius: 'var(--card-radius)', overflow: 'hidden' }}>
          {Array.from({ length: count }).map((_, i) => (
            <TableRowSkeleton key={i} />
          ))}
        </div>
      )
    case 'detail':
      return <DetailSkeleton />
    case 'form':
      return <FormSkeleton count={count} />
  }
}
