import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'md',
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
  const radiusClass = 'rounded-lg'

  const variantStyles: Record<string, React.CSSProperties> = {
    default: { backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' },
    secondary: { backgroundColor: 'var(--muted)', color: 'var(--foreground)' },
    outline: { backgroundColor: 'transparent', color: 'var(--foreground)', border: '1px solid var(--border)' },
    ghost: { backgroundColor: 'transparent', color: 'var(--foreground)' },
    destructive: { backgroundColor: 'var(--destructive)', color: 'var(--color-white)' },
  }

  return (
    <button
      className={`${baseClasses} ${radiusClass} ${sizeClasses[size]} ${className}`}
      style={variantStyles[variant]}
      disabled={disabled}
      onMouseEnter={(e) => {
        if (variant === 'default') (e.currentTarget.style.backgroundColor = 'var(--primary-hover)')
        if (variant === 'secondary' || variant === 'ghost') (e.currentTarget.style.backgroundColor = 'var(--hover-muted)')
      }}
      onMouseLeave={(e) => {
        (e.currentTarget.style.backgroundColor = variantStyles[variant].backgroundColor as string)
      }}
      {...props}
    >
      {children}
    </button>
  )
}
