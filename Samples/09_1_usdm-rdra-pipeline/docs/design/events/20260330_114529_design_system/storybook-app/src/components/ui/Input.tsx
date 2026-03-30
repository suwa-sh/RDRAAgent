import React from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || label?.replace(/\s+/g, '-').toLowerCase()

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium"
          style={{ color: 'var(--foreground)' }}
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className="h-10 px-3 rounded-md text-sm outline-none flex-1 min-w-0"
        style={{
          backgroundColor: 'var(--card-bg)',
          color: 'var(--foreground)',
          border: `1px solid ${error ? 'var(--destructive)' : 'var(--input-border)'}`,
          transition: `border-color var(--duration-fast) ease`,
        }}
        onFocus={(e) => {
          if (!error) e.currentTarget.style.borderColor = 'var(--input-focus-border)'
        }}
        onBlur={(e) => {
          if (!error) e.currentTarget.style.borderColor = 'var(--input-border)'
        }}
        {...props}
      />
      {error && (
        <p className="text-xs" style={{ color: 'var(--destructive)' }}>
          {error}
        </p>
      )}
    </div>
  )
}
