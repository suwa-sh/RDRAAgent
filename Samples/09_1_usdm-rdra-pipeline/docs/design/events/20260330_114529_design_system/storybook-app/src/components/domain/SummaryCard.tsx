import React from 'react'
import { Card } from '../ui/Card'
import { Icon } from '../ui/Icon'

export interface SummaryCardProps {
  title: string
  value: string
  change?: { value: string; positive: boolean }
  icon: string
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  change,
  icon,
}) => {
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--foreground-secondary)', marginBottom: '0.5rem' }}>
            {title}
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--foreground)' }}>
            {value}
          </div>
          {change && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                marginTop: '0.5rem',
                fontSize: '0.75rem',
                fontWeight: 500,
                color: change.positive ? 'var(--success)' : 'var(--destructive)',
              }}
            >
              <Icon name={change.positive ? 'arrow-up' : 'arrow-down'} size={12} />
              {change.value}
            </div>
          )}
        </div>
        <div
          style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--primary-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name={icon} size={20} />
        </div>
      </div>
    </Card>
  )
}
