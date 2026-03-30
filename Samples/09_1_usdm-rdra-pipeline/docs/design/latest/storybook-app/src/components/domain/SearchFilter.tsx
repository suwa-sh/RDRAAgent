import React, { useState } from 'react'
import { Icon } from '../ui/Icon'
import { Button } from '../ui/Button'

export interface SearchFilterProps {
  features?: string[]
  onSearch?: (query: string, filters: { features: string[]; minPrice: number; maxPrice: number; minRating: number }) => void
}

const allFeatures = ['プロジェクター', 'ホワイトボード', 'Wi-Fi', 'テレビ会議設備']

export const SearchFilter: React.FC<SearchFilterProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('')
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(50000)
  const [minRating, setMinRating] = useState(0)

  const toggleFeature = (feature: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]
    )
  }

  return (
    <div
      style={{
        padding: '1.5rem',
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      {/* Search input */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0 0.75rem',
            height: '2.5rem',
            border: '1px solid var(--input-border)',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--card-bg)',
          }}
        >
          <Icon name="search" size={16} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="エリア・会議室名で検索..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              color: 'var(--foreground)',
              fontSize: '0.875rem',
            }}
          />
        </div>
        <Button
          variant="default"
          onClick={() => onSearch?.(query, { features: selectedFeatures, minPrice, maxPrice, minRating })}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            <Icon name="search" size={16} />
            検索
          </span>
        </Button>
      </div>

      {/* Feature filters */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--foreground-secondary)', marginBottom: '0.5rem' }}>
          設備
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {allFeatures.map((feature) => {
            const selected = selectedFeatures.includes(feature)
            return (
              <button
                key={feature}
                onClick={() => toggleFeature(feature)}
                style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  border: `1px solid ${selected ? 'var(--primary)' : 'var(--border)'}`,
                  backgroundColor: selected ? 'var(--primary-light)' : 'transparent',
                  color: selected ? 'var(--primary)' : 'var(--foreground)',
                  cursor: 'pointer',
                  transition: 'all var(--duration-fast) ease',
                }}
              >
                {feature}
              </button>
            )
          })}
        </div>
      </div>

      {/* Price range */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--foreground-secondary)', marginBottom: '0.5rem' }}>
            価格帯
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              placeholder="下限"
              style={{
                flex: 1,
                minWidth: 0,
                height: '2.25rem',
                padding: '0 0.5rem',
                border: '1px solid var(--input-border)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                background: 'var(--card-bg)',
                color: 'var(--foreground)',
              }}
            />
            <span style={{ color: 'var(--foreground-secondary)', fontSize: '0.875rem' }}>~</span>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              placeholder="上限"
              style={{
                flex: 1,
                minWidth: 0,
                height: '2.25rem',
                padding: '0 0.5rem',
                border: '1px solid var(--input-border)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                background: 'var(--card-bg)',
                color: 'var(--foreground)',
              }}
            />
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--foreground-secondary)', marginBottom: '0.5rem' }}>
            最低評価
          </div>
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            {[1, 2, 3, 4, 5].map((r) => (
              <button
                key={r}
                onClick={() => setMinRating(r === minRating ? 0 : r)}
                style={{
                  width: '2rem',
                  height: '2.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${r <= minRating ? 'var(--rating)' : 'var(--border)'}`,
                  backgroundColor: r <= minRating ? 'var(--color-amber-50)' : 'transparent',
                  color: r <= minRating ? 'var(--rating)' : 'var(--foreground-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
