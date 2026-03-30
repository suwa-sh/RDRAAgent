import React from 'react'
import { Button } from '../ui/Button'

export interface PaginatedListProps {
  items: React.ReactNode[]
  page?: number
  totalPages?: number
  onPageChange?: (page: number) => void
}

export const PaginatedList: React.FC<PaginatedListProps> = ({
  items, page = 1, totalPages = 1, onPageChange,
}) => (
  <div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {items.map((item, i) => (
        <div key={i}>{item}</div>
      ))}
    </div>
    {totalPages > 1 && (
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px', alignItems: 'center' }}>
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange?.(page - 1)}>Prev</Button>
        <span style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>{page} / {totalPages}</span>
        <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => onPageChange?.(page + 1)}>Next</Button>
      </div>
    )}
  </div>
)
