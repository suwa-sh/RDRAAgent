import React from 'react'
import { Icon } from '../ui/Icon'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'

export interface SearchFilterProps {
  onSearch?: (filters: Record<string, string>) => void
}

export const SearchFilter: React.FC<SearchFilterProps> = ({ onSearch }) => {
  return (
    <div
      style={{
        padding: 'var(--spacing-4)',
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: 'var(--card-radius)',
      }}
    >
      <div className="flex items-center gap-2" style={{ marginBottom: 'var(--spacing-4)' }}>
        <Icon name="filter" size={18} />
        <span style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--foreground)' }}>
          検索条件
        </span>
      </div>
      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        <Input label="エリア" placeholder="例: 渋谷区" />
        <Input label="収容人数" placeholder="例: 10" type="number" />
        <Input label="最低価格 (円/時間)" placeholder="1000" type="number" />
        <Input label="最高価格 (円/時間)" placeholder="10000" type="number" />
      </div>
      <div className="flex justify-end gap-2" style={{ marginTop: 'var(--spacing-4)' }}>
        <Button variant="outline" size="sm">条件をクリア</Button>
        <Button variant="default" size="sm">
          <Icon name="search" size={14} />
          検索する
        </Button>
      </div>
    </div>
  )
}
