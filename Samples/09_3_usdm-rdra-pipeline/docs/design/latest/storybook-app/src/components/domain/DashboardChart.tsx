import React from 'react'
import { Card } from '../ui/Card'
import { Icon } from '../ui/Icon'

export interface DashboardChartProps {
  title: string
  data: { label: string; value: number }[]
  type?: 'bar' | 'line'
}

export const DashboardChart: React.FC<DashboardChartProps> = ({
  title,
  data,
  type = 'bar',
}) => {
  const maxValue = Math.max(...data.map((d) => d.value), 1)

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Icon name="chart" size={20} />
        <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>{title}</h3>
      </div>
      {type === 'bar' ? (
        <div className="flex items-end gap-2 h-40">
          {data.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-t"
                style={{
                  height: `${(d.value / maxValue) * 100}%`,
                  backgroundColor: 'var(--primary)',
                  minHeight: '4px',
                  transition: 'height var(--duration-slow)',
                }}
              />
              <span className="text-xs truncate w-full text-center" style={{ color: 'var(--muted-foreground)' }}>
                {d.label}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-40 flex items-center justify-center" style={{ color: 'var(--muted-foreground)' }}>
          <span className="text-sm">Line chart placeholder</span>
        </div>
      )}
    </Card>
  )
}
