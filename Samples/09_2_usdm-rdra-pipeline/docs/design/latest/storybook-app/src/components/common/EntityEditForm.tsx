import React from 'react'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'

export interface FieldConfig {
  name: string
  label: string
  type?: string
  placeholder?: string
  required?: boolean
}

export interface EntityEditFormProps {
  fields: FieldConfig[]
  onSubmit?: () => void
  submitLabel?: string
  isLoading?: boolean
}

export const EntityEditForm: React.FC<EntityEditFormProps> = ({
  fields,
  onSubmit,
  submitLabel = '保存する',
  isLoading = false,
}) => {
  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit?.()
      }}
    >
      {fields.map((field) => (
        <Input
          key={field.name}
          label={field.label}
          type={field.type || 'text'}
          placeholder={field.placeholder}
          required={field.required}
        />
      ))}
      <div className="flex justify-end" style={{ marginTop: 'var(--spacing-2)' }}>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? '処理中...' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
