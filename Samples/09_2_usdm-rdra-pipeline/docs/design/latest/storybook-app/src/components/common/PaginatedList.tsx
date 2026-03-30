import React from 'react'
import { Button } from '../ui/Button'

export interface PaginatedListProps {
  totalCount: number
  page: number
  perPage: number
  onPageChange?: (page: number) => void
  children: React.ReactNode
}

export const PaginatedList: React.FC<PaginatedListProps> = ({
  totalCount,
  page,
  perPage,
  onPageChange,
  children,
}) => {
  const totalPages = Math.ceil(totalCount / perPage)
  const startItem = (page - 1) * perPage + 1
  const endItem = Math.min(page * perPage, totalCount)

  return (
    <div>
      <div>{children}</div>
      <div
        className="flex items-center justify-between"
        style={{
          marginTop: 'var(--spacing-4)',
          paddingTop: 'var(--spacing-3)',
          borderTop: '1px solid var(--border)',
        }}
      >
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)' }}>
          {totalCount}件中 {startItem}-{endItem}件を表示
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => onPageChange?.(page - 1)}
          >
            前へ
          </Button>
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => onPageChange?.(page + 1)}
          >
            次へ
          </Button>
        </div>
      </div>
    </div>
  )
}
