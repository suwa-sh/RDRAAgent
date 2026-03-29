import React from 'react'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'

export interface PaginatedListProps {
  headers?: string[]
  rows?: string[][]
  cards?: React.ReactNode[]
  variant: 'table' | 'card'
  total: number
  page: number
  perPage: number
  onPageChange: (page: number) => void
  isLoading?: boolean
  emptyMessage?: string
}

function buildPageNumbers(current: number, totalPages: number): number[] {
  const pages: number[] = []
  const start = Math.max(1, current - 2)
  const end = Math.min(totalPages, current + 2)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
}

const SkeletonRow: React.FC<{ cols: number }> = ({ cols }) => (
  <tr>
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-[var(--table-cell-padding)] py-[var(--space-3)]">
        <div
          className="h-4 rounded-[var(--radius-md)] animate-pulse"
          style={{ background: 'var(--muted)', width: i === 0 ? '60%' : '80%' }}
        />
      </td>
    ))}
  </tr>
)

const SkeletonCard: React.FC = () => (
  <div
    className="rounded-[var(--card-radius)] border p-[var(--card-padding)] flex flex-col gap-[var(--space-3)] animate-pulse"
    style={{ borderColor: 'var(--border)', background: 'var(--card-bg)' }}
  >
    <div className="h-5 w-3/4 rounded-[var(--radius-md)]" style={{ background: 'var(--muted)' }} />
    <div className="h-4 w-1/2 rounded-[var(--radius-md)]" style={{ background: 'var(--muted)' }} />
    <div className="h-4 w-2/3 rounded-[var(--radius-md)]" style={{ background: 'var(--muted)' }} />
  </div>
)

export const PaginatedList: React.FC<PaginatedListProps> = ({
  headers = [],
  rows = [],
  cards = [],
  variant,
  total,
  page,
  perPage,
  onPageChange,
  isLoading = false,
  emptyMessage = 'データがありません',
}) => {
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const pageNumbers = buildPageNumbers(page, totalPages)
  const isEmpty = !isLoading && total === 0

  return (
    <div className="flex flex-col gap-[var(--space-4)]">
      {/* Table mode */}
      {variant === 'table' && (
        <div
          className="rounded-[var(--card-radius)] border overflow-hidden"
          style={{ borderColor: 'var(--border)' }}
        >
          <table className="w-full border-collapse">
            {headers.length > 0 && (
              <thead style={{ background: 'var(--table-header-bg)' }}>
                <tr>
                  {headers.map((h) => (
                    <th
                      key={h}
                      className="px-[var(--table-cell-padding)] py-[var(--space-3)] text-left text-[var(--text-sm)]"
                      style={{
                        fontWeight: 'var(--table-header-weight)',
                        color: 'var(--foreground)',
                        borderBottom: '1px solid var(--table-border)',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {isLoading
                ? Array.from({ length: perPage }).map((_, i) => (
                    <SkeletonRow key={i} cols={Math.max(headers.length, 3)} />
                  ))
                : isEmpty
                ? (
                  <tr>
                    <td
                      colSpan={Math.max(headers.length, 1)}
                      className="px-[var(--table-cell-padding)] py-[var(--space-12)] text-center text-[var(--text-sm)]"
                      style={{ color: 'var(--foreground-muted)' }}
                    >
                      <div className="flex flex-col items-center gap-[var(--space-3)]">
                        <Icon name="search" size={32} />
                        <span>{emptyMessage}</span>
                      </div>
                    </td>
                  </tr>
                )
                : rows.map((row, ri) => (
                  <tr
                    key={ri}
                    style={{
                      borderBottom: ri < rows.length - 1 ? '1px solid var(--table-border)' : 'none',
                    }}
                  >
                    {row.map((cell, ci) => (
                      <td
                        key={ci}
                        className="px-[var(--table-cell-padding)] text-[var(--text-sm)]"
                        style={{
                          height: 'var(--table-row-height)',
                          color: ci === 0 ? 'var(--foreground)' : 'var(--foreground-secondary)',
                        }}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      )}

      {/* Card mode */}
      {variant === 'card' && (
        <div>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-[var(--space-4)]">
              {Array.from({ length: perPage }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : isEmpty ? (
            <div
              className="flex flex-col items-center justify-center gap-[var(--space-4)] py-[var(--space-16)] rounded-[var(--card-radius)] border"
              style={{ borderColor: 'var(--border)', background: 'var(--card-bg)' }}
            >
              <Icon name="search" size={40} />
              <span
                className="text-[var(--text-base)]"
                style={{ color: 'var(--foreground-muted)' }}
              >
                {emptyMessage}
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-[var(--space-4)]">
              {cards.map((card, i) => (
                <div key={i}>{card}</div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {!isEmpty && (
        <div className="flex items-center justify-between">
          <p
            className="text-[var(--text-sm)]"
            style={{ color: 'var(--foreground-secondary)' }}
          >
            全 {total} 件 / {totalPages} ページ中 {page} ページ
          </p>
          <div className="flex items-center gap-[var(--space-1)]">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || isLoading}
              onClick={() => onPageChange(page - 1)}
              aria-label="前のページ"
            >
              前へ
            </Button>
            {pageNumbers.map((p) => (
              <Button
                key={p}
                variant={p === page ? 'default' : 'outline'}
                size="sm"
                disabled={isLoading}
                onClick={() => onPageChange(p)}
                aria-label={`${p}ページ`}
                aria-current={p === page ? 'page' : undefined}
              >
                {p}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages || isLoading}
              onClick={() => onPageChange(page + 1)}
              aria-label="次のページ"
            >
              次へ
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
