import React from 'react'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { Icon } from '../ui/Icon'

export interface FilterConfig {
  key: string
  label: string
  type: 'text' | 'number' | 'select'
  placeholder?: string
  options?: { value: string; label: string }[]
}

export interface SearchFilterPanelProps {
  filters: FilterConfig[]
  onFilter?: (values: Record<string, string>) => void
  onReset?: () => void
}

export const SearchFilterPanel: React.FC<SearchFilterPanelProps> = ({ filters, onFilter, onReset }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'flex-end', padding: '16px', backgroundColor: 'var(--muted)', borderRadius: '12px' }}>
    {filters.map((f) => (
      <div key={f.key} style={{ flex: '1 1 180px' }}>
        <Input label={f.label} placeholder={f.placeholder || f.label} type={f.type === 'number' ? 'number' : 'text'} />
      </div>
    ))}
    <div style={{ display: 'flex', gap: '8px' }}>
      <Button variant="default" onClick={() => onFilter?.({})}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <Icon name="search" size={16} /> Search
        </span>
      </Button>
      <Button variant="outline" onClick={onReset}>Reset</Button>
    </div>
  </div>
)
