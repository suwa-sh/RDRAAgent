import React from 'react'

export interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'info' | 'outline'
  children: React.ReactNode
  className?: string
}

const variantStyles: Record<string, { bg: string; color: string; border: string }> = {
  default: {
    bg: 'var(--primary)',
    color: 'var(--primary-foreground)',
    border: 'transparent',
  },
  success: {
    bg: 'var(--success-light)',
    color: 'var(--success)',
    border: 'transparent',
  },
  warning: {
    bg: 'var(--warning-light)',
    color: 'var(--warning)',
    border: 'transparent',
  },
  destructive: {
    bg: 'var(--destructive-light)',
    color: 'var(--destructive)',
    border: 'transparent',
  },
  info: {
    bg: 'var(--info-light)',
    color: 'var(--info)',
    border: 'transparent',
  },
  outline: {
    bg: 'transparent',
    color: 'var(--foreground)',
    border: 'var(--border)',
  },
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  children,
  className = '',
}) => {
  const v = variantStyles[variant] || variantStyles.default

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
      style={{
        backgroundColor: v.bg,
        color: v.color,
        border: `1px solid ${v.border}`,
        height: 'var(--badge-height)',
      }}
    >
      {children}
    </span>
  )
}
