import React from 'react'

export interface PriceDisplayProps {
  amount: number
  currency?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-lg font-semibold',
  lg: 'text-2xl font-bold',
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  amount,
  currency = 'JPY',
  size = 'md',
  className = '',
}) => {
  const formatted = new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)

  return (
    <span className={`${sizeClasses[size]} ${className}`} style={{ color: 'var(--foreground)' }}>
      {formatted}
    </span>
  )
}
