import React from 'react'
import { Card } from '../ui/Card'
import { Icon } from '../ui/Icon'

export interface SummaryCardProps {
  label: string
  value: string
  change?: number
  trend?: 'up' | 'down' | 'flat'
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  label,
  value,
  change,
  trend = 'flat',
}) => {
  const trendColor = trend === 'up' ? 'var(--success)' : trend === 'down' ? 'var(--destructive)' : 'var(--foreground-secondary)'
  const trendIcon = trend === 'up' ? 'arrow-up' : trend === 'down' ? 'arrow-down' : undefined

  return (
    <Card>
      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)', marginBottom: 'var(--spacing-1)' }}>
        {label}
      </div>
      <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--foreground)' }}>
        {value}
      </div>
      {change !== undefined && (
        <div
          className="inline-flex items-center gap-1"
          style={{ fontSize: 'var(--text-sm)', color: trendColor, marginTop: 'var(--spacing-1)' }}
        >
          {trendIcon && <Icon name={trendIcon} size={14} />}
          <span>{change > 0 ? '+' : ''}{change}%</span>
          <span style={{ color: 'var(--foreground-secondary)' }}>前月比</span>
        </div>
      )}
    </Card>
  )
}
