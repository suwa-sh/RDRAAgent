import React from 'react'

export interface PriceDisplayProps {
  amount: number
  unit?: 'hour' | 'day'
  currency?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: { price: 'var(--text-base)', unit: 'var(--text-xs)' },
  md: { price: 'var(--room-card-price-size)', unit: 'var(--text-sm)' },
  lg: { price: 'var(--text-3xl)', unit: 'var(--text-base)' },
}

const unitLabels = { hour: '時間', day: '日' }

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  amount,
  unit = 'hour',
  currency = '¥',
  size = 'md',
}) => (
  <span className="inline-flex items-baseline gap-[var(--space-1)]">
    <span
      className="text-[color:var(--foreground)]"
      style={{ fontSize: sizeMap[size].price, fontWeight: 'var(--room-card-price-weight)' }}
    >
      {currency}{amount.toLocaleString()}
    </span>
    <span
      className="text-[color:var(--foreground-secondary)]"
      style={{ fontSize: sizeMap[size].unit }}
    >
      /{unitLabels[unit]}
    </span>
  </span>
)
