import React from 'react'

export interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'info' | 'outline'
  children: React.ReactNode
  className?: string
}

const variantStyles: Record<string, { bg: string; color: string; border?: string }> = {
  default: { bg: 'var(--primary-light)', color: 'var(--primary)' },
  success: { bg: 'var(--success-light)', color: 'var(--success)' },
  warning: { bg: 'var(--warning-light)', color: 'var(--warning)' },
  destructive: { bg: 'var(--destructive-light)', color: 'var(--destructive)' },
  info: { bg: 'var(--info-light)', color: 'var(--info)' },
  outline: { bg: 'transparent', color: 'var(--foreground)', border: '1px solid var(--border)' },
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', children, className = '' }) => {
  const styles = variantStyles[variant]
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${className}`}
      style={{
        backgroundColor: styles.bg,
        color: styles.color,
        border: styles.border || 'none',
      }}
    >
      {children}
    </span>
  )
}
