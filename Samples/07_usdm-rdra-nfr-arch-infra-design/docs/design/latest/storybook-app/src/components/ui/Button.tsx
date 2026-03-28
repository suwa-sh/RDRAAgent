import React from 'react'

export type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  default: 'bg-[var(--primary)] hover:bg-[var(--primary-hover)]',
  secondary: 'bg-[var(--muted)] hover:bg-[var(--hover-muted,var(--color-gray-200))]',
  outline: 'border border-[var(--border)] hover:bg-[var(--muted)]',
  ghost: 'hover:bg-[var(--muted)]',
  destructive: 'bg-[var(--destructive)] hover:bg-[var(--color-red-700)]',
}

const variantColors: Record<ButtonVariant, string> = {
  default: 'var(--primary-foreground)',
  secondary: 'var(--foreground)',
  outline: 'var(--foreground)',
  ghost: 'var(--foreground)',
  destructive: 'var(--destructive-foreground)',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-[var(--button-height-sm)] px-[var(--button-px-sm)] text-[var(--text-xs)]',
  md: 'h-[var(--button-height-md)] px-[var(--button-px-md)] text-[var(--button-font-size)]',
  lg: 'h-[var(--button-height-lg)] px-[var(--button-px-lg)] text-[var(--text-base)]',
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'md',
  loading = false,
  disabled,
  children,
  className = '',
  style,
  ...props
}) => (
  <button
    className={[
      'inline-flex items-center justify-center gap-2',
      'rounded-[var(--button-radius)]',
      'font-[var(--button-font-weight)]',
      'transition-colors duration-[var(--duration-normal)]',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      variantClasses[variant],
      sizeStyles[size],
      className,
    ].join(' ')}
    style={{ color: variantColors[variant], ...style }}
    disabled={disabled || loading}
    {...props}
  >
    {loading && (
      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    )}
    {children}
  </button>
)
