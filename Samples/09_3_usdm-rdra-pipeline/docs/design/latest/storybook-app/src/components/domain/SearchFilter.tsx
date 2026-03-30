import React from 'react'
import { Icon } from '../ui/Icon'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'

export interface SearchFilterProps {
  onFilter?: (filters: Record<string, string>) => void
}

export const SearchFilter: React.FC<SearchFilterProps> = ({ onFilter }) => {
  const [keyword, setKeyword] = React.useState('')

  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
      <div className="flex items-center gap-2 mb-4">
        <Icon name="search" size={20} />
        <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>会議室を検索</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Input
          label="キーワード"
          placeholder="会議室名・エリア"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <Input
          label="価格帯 (上限)"
          placeholder="例: 10000"
          type="number"
        />
        <Input
          label="収容人数 (最小)"
          placeholder="例: 10"
          type="number"
        />
      </div>
      <div className="flex items-center gap-3 mt-4">
        <Button
          variant="default"
          onClick={() => onFilter?.({ keyword })}
        >
          <span className="inline-flex items-center gap-1">
            <Icon name="search" size={16} /> 検索
          </span>
        </Button>
        <Button variant="ghost">
          <span className="inline-flex items-center gap-1">
            <Icon name="filter" size={16} /> 詳細条件
          </span>
        </Button>
      </div>
    </div>
  )
}
