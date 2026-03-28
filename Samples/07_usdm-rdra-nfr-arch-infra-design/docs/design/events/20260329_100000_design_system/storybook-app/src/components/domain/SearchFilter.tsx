import React from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { StarRating } from './StarRating'

export interface SearchFilterProps {
  onSearch?: (filters: Record<string, unknown>) => void
}

export const SearchFilter: React.FC<SearchFilterProps> = ({ onSearch }) => {
  const [roomType, setRoomType] = React.useState<'all' | 'physical' | 'virtual'>('all')
  const [selectedTools, setSelectedTools] = React.useState<Set<string>>(new Set())

  const toggleTool = (tool: string) => {
    setSelectedTools(prev => {
      const next = new Set(prev)
      if (next.has(tool)) next.delete(tool)
      else next.add(tool)
      return next
    })
  }

  return (
    <Card className="flex flex-col gap-[var(--space-4)]">
      <h3 className="text-[var(--text-base)] font-[var(--font-semibold)] text-[color:var(--foreground)]">
        検索条件
      </h3>

      {/* 会議室種別 */}
      <div className="flex flex-col gap-[var(--space-2)]">
        <label className="text-[var(--text-sm)] font-[var(--font-medium)] text-[color:var(--foreground)]">会議室種別</label>
        <div className="flex gap-[var(--space-2)]">
          {(['all', 'physical', 'virtual'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setRoomType(type)}
              className={[
                'px-[var(--space-3)] py-[var(--space-1-5)] rounded-[var(--radius-lg)] text-[var(--text-sm)] transition-colors border',
                roomType === type
                  ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[color:var(--primary)] font-[var(--font-medium)]'
                  : 'border-[var(--border)] bg-[var(--muted)] text-[color:var(--foreground-secondary)] hover:bg-[var(--hover-muted,var(--color-gray-200))]',
              ].join(' ')}
            >
              {{ all: 'すべて', physical: '物理', virtual: 'バーチャル' }[type]}
            </button>
          ))}
        </div>
      </div>

      {/* 会議ツール種別 */}
      <div className="flex flex-col gap-[var(--space-2)]">
        <label className="text-[var(--text-sm)] font-[var(--font-medium)] text-[color:var(--foreground)]">会議ツール</label>
        <div className="flex flex-wrap gap-[var(--space-2)]">
          {['Zoom', 'Teams', 'Google Meet'].map((tool) => (
            <button
              key={tool}
              onClick={() => toggleTool(tool)}
              className={[
                'px-[var(--space-3)] py-[var(--space-1-5)] rounded-[var(--radius-lg)] text-[var(--text-sm)] transition-colors border cursor-pointer',
                selectedTools.has(tool)
                  ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[color:var(--primary)] font-[var(--font-medium)]'
                  : 'border-[var(--border)] text-[color:var(--foreground-secondary)] hover:bg-[var(--muted)]',
              ].join(' ')}
            >
              {tool}
            </button>
          ))}
        </div>
      </div>

      {/* 収容人数 */}
      <div className="flex flex-col gap-[var(--space-2)]">
        <label className="text-[var(--text-sm)] font-[var(--font-medium)] text-[color:var(--foreground)]">収容人数</label>
        <input
          type="range"
          min={1}
          max={100}
          defaultValue={10}
          className="w-full accent-[var(--primary)]"
        />
        <div className="flex justify-between text-[var(--text-xs)] text-[color:var(--foreground-muted)]">
          <span>1名</span><span>100名</span>
        </div>
      </div>

      {/* 価格帯 */}
      <div className="flex flex-col gap-[var(--space-2)]">
        <label className="text-[var(--text-sm)] font-[var(--font-medium)] text-[color:var(--foreground)]">価格帯</label>
        <div className="flex items-center gap-[var(--space-2)]">
          <input
            type="number"
            placeholder="¥0"
            className="flex-1 min-w-0 h-[var(--input-height)] px-[var(--input-px)] rounded-[var(--input-radius)] border border-[var(--input-border)] text-[var(--input-font-size)] bg-[var(--background)] text-[color:var(--foreground)]"
          />
          <span className="text-[color:var(--foreground-muted)] shrink-0">~</span>
          <input
            type="number"
            placeholder="¥50,000"
            className="flex-1 min-w-0 h-[var(--input-height)] px-[var(--input-px)] rounded-[var(--input-radius)] border border-[var(--input-border)] text-[var(--input-font-size)] bg-[var(--background)] text-[color:var(--foreground)]"
          />
        </div>
      </div>

      {/* 評価 */}
      <div className="flex flex-col gap-[var(--space-2)]">
        <label className="text-[var(--text-sm)] font-[var(--font-medium)] text-[color:var(--foreground)]">最低評価</label>
        <div className="grid grid-cols-2 gap-[var(--space-2)]">
          {[1, 2, 3, 4].map((star) => (
            <button
              key={star}
              className="flex flex-col items-center gap-[var(--space-0-5)] px-[var(--space-2)] py-[var(--space-1-5)] rounded-[var(--radius-md)] border border-[var(--border)] hover:bg-[var(--muted)] transition-colors"
            >
              <StarRating value={star} size="sm" readOnly />
              <span className="text-[var(--text-xs)]" style={{ color: 'var(--foreground-secondary)' }}>以上</span>
            </button>
          ))}
        </div>
      </div>

      <Button size="lg" className="w-full mt-[var(--space-2)]" onClick={() => onSearch?.({ roomType })}>
        検索する
      </Button>
    </Card>
  )
}
