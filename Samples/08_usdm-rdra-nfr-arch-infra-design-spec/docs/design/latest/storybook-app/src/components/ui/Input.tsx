import React from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', id, ...props }) => {
  const inputId = id || label?.replace(/\s/g, '-').toLowerCase()
  return (
    <div className="flex flex-col gap-[var(--space-1-5)]">
      {label && (
        <label htmlFor={inputId} className="text-[var(--text-sm)] font-[var(--font-medium)] text-[color:var(--foreground)]">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={[
          'h-[var(--input-height)] px-[var(--input-px)] py-[var(--input-py)]',
          'rounded-[var(--input-radius)]',
          'border text-[var(--input-font-size)]',
          'bg-[var(--background)] text-[color:var(--foreground)]',
          'transition-colors duration-[var(--duration-fast)]',
          'placeholder:text-[color:var(--foreground-muted)]',
          error
            ? 'border-[var(--destructive)] focus:outline-2 focus:outline-[var(--destructive)]'
            : 'border-[var(--input-border)] focus:outline-2 focus:outline-[var(--input-focus-ring)]',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--muted)]',
          className,
        ].join(' ')}
        {...props}
      />
      {error && <p className="text-[var(--text-xs)] text-[color:var(--destructive)]">{error}</p>}
    </div>
  )
}
