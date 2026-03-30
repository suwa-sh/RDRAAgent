import React from 'react'

export interface PriceDisplayProps {
  amount: number
  originalAmount?: number
  size?: 'sm' | 'md' | 'lg'
  suffix?: string
}

const sizeStyles: Record<string, { fontSize: string; originalSize: string }> = {
  sm: { fontSize: 'var(--text-sm)', originalSize: 'var(--text-xs)' },
  md: { fontSize: 'var(--text-lg)', originalSize: 'var(--text-sm)' },
  lg: { fontSize: 'var(--text-2xl)', originalSize: 'var(--text-base)' },
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  amount,
  originalAmount,
  size = 'md',
  suffix = '/時間',
}) => {
  const s = sizeStyles[size]
  const formatted = new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
  }).format(amount)

  return (
    <div className="inline-flex items-baseline gap-1.5">
      {originalAmount && originalAmount > amount && (
        <span
          style={{
            fontSize: s.originalSize,
            color: 'var(--foreground-secondary)',
            textDecoration: 'line-through',
          }}
        >
          {new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(originalAmount)}
        </span>
      )}
      <span
        style={{
          fontSize: s.fontSize,
          fontWeight: 'var(--font-bold)',
          color: 'var(--foreground)',
        }}
      >
        {formatted}
      </span>
      {suffix && (
        <span
          style={{
            fontSize: s.originalSize || 'var(--text-xs)',
            color: 'var(--foreground-secondary)',
          }}
        >
          {suffix}
        </span>
      )}
    </div>
  )
}
