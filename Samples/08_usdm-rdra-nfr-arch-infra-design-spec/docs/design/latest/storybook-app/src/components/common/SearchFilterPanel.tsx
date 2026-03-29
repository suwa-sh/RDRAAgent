import React, { useState, useCallback } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export interface FilterField {
  name: string
  label: string
  type: 'text' | 'select' | 'date' | 'number'
  options?: Array<{ value: string; label: string }>
  placeholder?: string
}

export interface SearchFilterPanelProps {
  fields: FilterField[]
  onSearch: (values: Record<string, string>) => void
  onClear: () => void
  isLoading?: boolean
}

export const SearchFilterPanel: React.FC<SearchFilterPanelProps> = ({
  fields,
  onSearch,
  onClear,
  isLoading = false,
}) => {
  const emptyValues = Object.fromEntries(fields.map((f) => [f.name, '']))
  const [values, setValues] = useState<Record<string, string>>(emptyValues)

  const handleChange = useCallback((name: string, val: string) => {
    setValues((prev) => ({ ...prev, [name]: val }))
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(values)
  }

  const handleClear = () => {
    setValues(emptyValues)
    onClear()
  }

  return (
    <form onSubmit={handleSearch} className="flex flex-col gap-[var(--space-4)]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[var(--space-4)]">
        {fields.map((field) => {
          if (field.type === 'select') {
            return (
              <div key={field.name} className="flex flex-col gap-[var(--space-1-5)]">
                <label
                  htmlFor={field.name}
                  className="text-[var(--text-sm)] font-[var(--font-medium)]"
                  style={{ color: 'var(--foreground)' }}
                >
                  {field.label}
                </label>
                <select
                  id={field.name}
                  name={field.name}
                  value={values[field.name] ?? ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className={[
                    'h-[var(--input-height)] px-[var(--input-px)]',
                    'rounded-[var(--input-radius)]',
                    'border border-[var(--input-border)]',
                    'text-[var(--input-font-size)]',
                    'bg-[var(--background)]',
                    'focus:outline-2 focus:outline-[var(--input-focus-ring)]',
                    'transition-colors duration-[var(--duration-fast)]',
                  ].join(' ')}
                  style={{ color: 'var(--foreground)' }}
                >
                  <option value="">{field.placeholder ?? '-- 選択 --'}</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            )
          }

          return (
            <Input
              key={field.name}
              id={field.name}
              name={field.name}
              type={field.type}
              label={field.label}
              placeholder={field.placeholder}
              value={values[field.name] ?? ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
            />
          )
        })}
      </div>

      {/* Action row */}
      <div className="flex items-center gap-[var(--space-3)]">
        <Button
          type="submit"
          variant="default"
          loading={isLoading}
        >
          検索する
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={handleClear}
          disabled={isLoading}
        >
          クリア
        </Button>
      </div>
    </form>
  )
}
