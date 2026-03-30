import React from 'react'
import { Icon } from '../ui/Icon'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'

export interface FilterConfig {
  name: string
  label: string
  type?: 'text' | 'number' | 'date' | 'select'
  placeholder?: string
  options?: { value: string; label: string }[]
}

export interface SearchFilterPanelProps {
  filters: FilterConfig[]
  onFilterChange?: (filters: Record<string, string>) => void
  onReset?: () => void
}

export const SearchFilterPanel: React.FC<SearchFilterPanelProps> = ({
  filters,
  onReset,
}) => {
  return (
    <div
      style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: 'var(--card-radius)',
        padding: 'var(--spacing-4)',
      }}
    >
      <div className="flex items-center gap-2" style={{ marginBottom: 'var(--spacing-4)' }}>
        <Icon name="filter" size={18} />
        <span
          style={{
            fontSize: 'var(--text-base)',
            fontWeight: 'var(--font-semibold)',
            color: 'var(--foreground)',
          }}
        >
          検索条件
        </span>
      </div>
      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(12rem, 1fr))' }}>
        {filters.map((filter) => (
          <Input
            key={filter.name}
            label={filter.label}
            type={filter.type === 'select' ? 'text' : filter.type || 'text'}
            placeholder={filter.placeholder}
          />
        ))}
      </div>
      <div className="flex justify-end gap-2" style={{ marginTop: 'var(--spacing-4)' }}>
        <Button variant="outline" size="sm" onClick={onReset}>
          条件をクリア
        </Button>
        <Button variant="default" size="sm">
          <Icon name="search" size={14} />
          検索する
        </Button>
      </div>
    </div>
  )
}
