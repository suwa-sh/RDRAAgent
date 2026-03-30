import React from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  style,
  id,
  ...props
}) => {
  const inputId = id || label?.replace(/\s+/g, '-').toLowerCase()

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-medium)',
            color: 'var(--foreground)',
          }}
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className="flex-1 min-w-0 outline-none transition-colors"
        style={{
          height: 'var(--input-height)',
          padding: `0 var(--input-padding-x)`,
          borderRadius: 'var(--input-radius)',
          border: `1px solid ${error ? 'var(--destructive)' : 'var(--input-border)'}`,
          backgroundColor: 'var(--background)',
          color: 'var(--foreground)',
          fontSize: 'var(--text-sm)',
          ...style,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = error ? 'var(--destructive)' : 'var(--ring)'
          e.currentTarget.style.boxShadow = `0 0 0 2px ${error ? 'var(--destructive-light)' : 'var(--info-light)'}`
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error ? 'var(--destructive)' : 'var(--input-border)'
          e.currentTarget.style.boxShadow = 'none'
        }}
        {...props}
      />
      {error && (
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--destructive)' }}>
          {error}
        </span>
      )}
    </div>
  )
}
