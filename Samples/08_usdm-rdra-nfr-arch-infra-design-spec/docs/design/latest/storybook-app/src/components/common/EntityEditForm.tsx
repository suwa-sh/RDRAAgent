import React, { useState, useCallback } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

export interface EntityEditField {
  name: string
  label: string
  type: 'text' | 'number' | 'email' | 'tel' | 'textarea'
  value: string
  required?: boolean
}

export interface EntityEditFormProps {
  title: string
  fields: EntityEditField[]
  onSave: (values: Record<string, string>) => void
  onCancel: () => void
  isLoading?: boolean
  saveSuccess?: boolean
}

export const EntityEditForm: React.FC<EntityEditFormProps> = ({
  title,
  fields,
  onSave,
  onCancel,
  isLoading = false,
  saveSuccess = false,
}) => {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(fields.map((f) => [f.name, f.value]))
  )

  const initialValues = Object.fromEntries(fields.map((f) => [f.name, f.value]))
  const isDirty = fields.some((f) => values[f.name] !== initialValues[f.name])

  const handleChange = useCallback((name: string, val: string) => {
    setValues((prev) => ({ ...prev, [name]: val }))
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(values)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-[var(--space-5)]"
      noValidate
    >
      {/* Title row */}
      <div className="flex items-center justify-between">
        <h2
          className="text-[var(--text-xl)] font-[var(--font-semibold)]"
          style={{ color: 'var(--foreground)' }}
        >
          {title}
        </h2>
        {saveSuccess && (
          <Badge variant="success">保存しました</Badge>
        )}
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-[var(--space-4)]">
        {fields.map((field) => {
          if (field.type === 'textarea') {
            return (
              <div key={field.name} className="flex flex-col gap-[var(--space-1-5)]">
                <label
                  htmlFor={field.name}
                  className="text-[var(--text-sm)] font-[var(--font-medium)]"
                  style={{ color: 'var(--foreground)' }}
                >
                  {field.label}
                  {field.required && (
                    <span
                      className="ml-[var(--space-1)] text-[var(--text-xs)]"
                      style={{ color: 'var(--destructive)' }}
                    >
                      必須
                    </span>
                  )}
                </label>
                <textarea
                  id={field.name}
                  name={field.name}
                  value={values[field.name] ?? ''}
                  required={field.required}
                  rows={4}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className={[
                    'px-[var(--input-px)] py-[var(--input-py)]',
                    'rounded-[var(--input-radius)]',
                    'border border-[var(--input-border)]',
                    'text-[var(--input-font-size)]',
                    'bg-[var(--background)]',
                    'resize-y',
                    'focus:outline-2 focus:outline-[var(--input-focus-ring)]',
                    'transition-colors duration-[var(--duration-fast)]',
                  ].join(' ')}
                  style={{ color: 'var(--foreground)' }}
                />
              </div>
            )
          }

          return (
            <Input
              key={field.name}
              id={field.name}
              name={field.name}
              type={field.type}
              label={
                field.required
                  ? field.label + ' *'
                  : field.label
              }
              value={values[field.name] ?? ''}
              required={field.required}
              onChange={(e) => handleChange(field.name, e.target.value)}
            />
          )
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-[var(--space-3)] pt-[var(--space-2)] border-t" style={{ borderColor: 'var(--border)' }}>
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isLoading}
        >
          キャンセル
        </Button>
        <Button
          type="submit"
          variant="default"
          loading={isLoading}
          disabled={!isDirty || isLoading}
        >
          保存する
        </Button>
      </div>
    </form>
  )
}
