import React from 'react'
import { Icon } from '../ui/Icon'

export interface StepTrackerProps {
  steps: string[]
  currentStep: number
}

export const StepTracker: React.FC<StepTrackerProps> = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center" style={{ gap: 0 }}>
      {steps.map((step, i) => {
        const isCompleted = i < currentStep
        const isCurrent = i === currentStep
        const isLast = i === steps.length - 1

        return (
          <React.Fragment key={i}>
            <div className="flex flex-col items-center" style={{ minWidth: '5rem' }}>
              <div
                className="flex items-center justify-center rounded-full"
                style={{
                  width: '2rem',
                  height: '2rem',
                  backgroundColor: isCompleted
                    ? 'var(--success)'
                    : isCurrent
                      ? 'var(--primary)'
                      : 'var(--muted)',
                  color: isCompleted || isCurrent ? 'var(--color-white)' : 'var(--foreground-secondary)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-semibold)',
                }}
              >
                {isCompleted ? <Icon name="check" size={14} /> : i + 1}
              </div>
              <span
                style={{
                  marginTop: 'var(--spacing-1)',
                  fontSize: 'var(--text-xs)',
                  color: isCurrent ? 'var(--primary)' : 'var(--foreground-secondary)',
                  fontWeight: isCurrent ? 'var(--font-semibold)' : 'var(--font-normal)',
                  textAlign: 'center',
                }}
              >
                {step}
              </span>
            </div>
            {!isLast && (
              <div
                style={{
                  flex: 1,
                  height: '2px',
                  backgroundColor: isCompleted ? 'var(--success)' : 'var(--border)',
                  marginBottom: '1.5rem',
                  minWidth: '2rem',
                }}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
