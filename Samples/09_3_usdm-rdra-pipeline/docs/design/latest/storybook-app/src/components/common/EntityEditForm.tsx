import React from 'react'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'

export interface FieldConfig {
  key: string
  label: string
  type?: 'text' | 'number' | 'email' | 'tel' | 'textarea'
  placeholder?: string
  required?: boolean
}

export interface EntityEditFormProps {
  fields: FieldConfig[]
  onSubmit?: (values: Record<string, string>) => void
  initialValues?: Record<string, string>
  submitLabel?: string
}

export const EntityEditForm: React.FC<EntityEditFormProps> = ({
  fields, onSubmit, initialValues = {}, submitLabel = 'Submit',
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '640px' }}>
    {fields.map((f) => (
      <div key={f.key}>
        {f.type === 'textarea' ? (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{f.label}{f.required && ' *'}</label>
            <textarea
              className="flex-1 min-w-0 rounded-lg px-3 py-2 text-sm outline-none"
              style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)', border: '1px solid var(--border)', minHeight: '100px', resize: 'vertical' }}
              placeholder={f.placeholder || f.label}
              defaultValue={initialValues[f.key]}
            />
          </div>
        ) : (
          <Input
            label={`${f.label}${f.required ? ' *' : ''}`}
            type={f.type || 'text'}
            placeholder={f.placeholder || f.label}
            defaultValue={initialValues[f.key]}
          />
        )}
      </div>
    ))}
    <div><Button size="lg" onClick={() => onSubmit?.({})}>{ submitLabel }</Button></div>
  </div>
)
