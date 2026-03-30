import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

const variantStyles: Record<string, { bg: string; color: string; border: string; hoverBg: string }> = {
  default: {
    bg: 'var(--primary)',
    color: 'var(--primary-foreground)',
    border: 'transparent',
    hoverBg: 'var(--primary-hover)',
  },
  secondary: {
    bg: 'var(--muted)',
    color: 'var(--foreground)',
    border: 'transparent',
    hoverBg: 'var(--hover-muted)',
  },
  outline: {
    bg: 'transparent',
    color: 'var(--foreground)',
    border: 'var(--border)',
    hoverBg: 'var(--muted)',
  },
  ghost: {
    bg: 'transparent',
    color: 'var(--foreground)',
    border: 'transparent',
    hoverBg: 'var(--muted)',
  },
  destructive: {
    bg: 'var(--destructive)',
    color: 'var(--destructive-foreground)',
    border: 'transparent',
    hoverBg: 'var(--color-red-700, #B91C1C)',
  },
}

const sizeClasses: Record<string, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'md',
  children,
  className = '',
  disabled,
  ...props
}) => {
  const styles = variantStyles[variant] || variantStyles.default

  return (
    <button
      className={`inline-flex items-center justify-center font-medium transition-colors rounded-md cursor-pointer
        ${sizeClasses[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}`}
      style={{
        backgroundColor: styles.bg,
        color: styles.color,
        border: `1px solid ${styles.border}`,
      }}
      disabled={disabled}
      onMouseEnter={(e) => {
        if (!disabled) (e.currentTarget as HTMLElement).style.backgroundColor = styles.hoverBg
      }}
      onMouseLeave={(e) => {
        if (!disabled) (e.currentTarget as HTMLElement).style.backgroundColor = styles.bg
      }}
      {...props}
    >
      {children}
    </button>
  )
}
