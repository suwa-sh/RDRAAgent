import React from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => (
  <div className="flex flex-col gap-1">
    {label && (
      <label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
        {label}
      </label>
    )}
    <input
      className={`flex-1 min-w-0 rounded-lg px-3 py-2 text-sm outline-none transition-colors ${className}`}
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)',
        border: `1px solid ${error ? 'var(--destructive)' : 'var(--border)'}`,
        height: '40px',
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = error ? 'var(--destructive)' : 'var(--ring)'
        e.currentTarget.style.boxShadow = `0 0 0 2px ${error ? 'var(--destructive-light)' : 'var(--info-light)'}`
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = error ? 'var(--destructive)' : 'var(--border)'
        e.currentTarget.style.boxShadow = 'none'
      }}
      {...props}
    />
    {error && (
      <span className="text-xs" style={{ color: 'var(--destructive)' }}>
        {error}
      </span>
    )}
  </div>
)
