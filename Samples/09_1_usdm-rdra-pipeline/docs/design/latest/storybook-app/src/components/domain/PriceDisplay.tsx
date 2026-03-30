import React from 'react'

export interface PriceDisplayProps {
  amount: number
  currency?: string
  size?: 'sm' | 'md' | 'lg'
  suffix?: string
}

const sizeStyles: Record<string, { fontSize: string; fontWeight: number }> = {
  sm: { fontSize: '0.875rem', fontWeight: 500 },
  md: { fontSize: '1.125rem', fontWeight: 600 },
  lg: { fontSize: '1.5rem', fontWeight: 700 },
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  amount,
  currency = 'JPY',
  size = 'md',
  suffix,
}) => {
  const formatted = new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount)

  const style = sizeStyles[size]

  return (
    <span
      style={{
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        color: 'var(--foreground)',
        whiteSpace: 'nowrap',
      }}
    >
      {formatted}
      {suffix && (
        <span style={{ fontSize: '0.75em', fontWeight: 400, color: 'var(--foreground-secondary)' }}>
          {suffix}
        </span>
      )}
    </span>
  )
}
