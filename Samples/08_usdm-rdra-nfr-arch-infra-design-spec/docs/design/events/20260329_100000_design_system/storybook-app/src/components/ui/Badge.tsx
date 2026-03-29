import React from 'react'

export type BadgeVariant = 'default' | 'success' | 'warning' | 'destructive' | 'info' | 'virtual' | 'outline'

export interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-[var(--muted)]',
  success: 'bg-[var(--success-light)]',
  warning: 'bg-[var(--warning-light)]',
  destructive: 'bg-[var(--destructive-light)]',
  info: 'bg-[var(--info-light)]',
  virtual: 'bg-[var(--virtual-light)]',
  outline: 'border border-[var(--border)]',
}

const variantColors: Record<BadgeVariant, string> = {
  default: 'var(--foreground-secondary)',
  success: 'var(--color-green-700)',
  warning: 'var(--color-amber-500)',
  destructive: 'var(--color-red-700)',
  info: 'var(--color-blue-700)',
  virtual: 'var(--color-violet-600)',
  outline: 'var(--foreground-secondary)',
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', children, className = '' }) => (
  <span
    className={[
      'inline-flex items-center',
      'h-[var(--badge-height)] px-[var(--badge-px)]',
      'rounded-[var(--badge-radius)]',
      'text-[var(--badge-font-size)] font-[var(--badge-font-weight)]',
      'whitespace-nowrap',
      variantClasses[variant],
      className,
    ].join(' ')}
    style={{ color: variantColors[variant] }}
  >
    {children}
  </span>
)
