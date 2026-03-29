import React from 'react'
import { Card } from '../ui/Card'
import { Icon } from '../ui/Icon'

export type KeyStep = 'lent' | 'in-use' | 'returned'

export interface KeyHandoverTrackerProps {
  currentStep: KeyStep
  lentAt?: string
  returnDue?: string
  returnedAt?: string
}

const steps: { key: KeyStep; label: string }[] = [
  { key: 'lent', label: '貸出済' },
  { key: 'in-use', label: '利用中' },
  { key: 'returned', label: '返却済' },
]

const stepIndex: Record<KeyStep, number> = { lent: 0, 'in-use': 1, returned: 2 }

export const KeyHandoverTracker: React.FC<KeyHandoverTrackerProps> = ({
  currentStep,
  lentAt,
  returnDue,
  returnedAt,
}) => {
  const current = stepIndex[currentStep]

  return (
    <Card>
      <div className="flex items-center gap-[var(--space-2)] mb-[var(--space-4)]">
        <Icon name="key" size={24} />
        <span className="text-[var(--text-base)] font-[var(--font-semibold)]" style={{ color: 'var(--foreground)' }}>
          鍵ステータス
        </span>
      </div>

      <div className="flex items-center gap-0 mb-[var(--space-4)]">
        {steps.map((step, i) => {
          const isCompleted = i < current
          const isCurrent = i === current
          const isPending = i > current
          return (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center gap-[var(--space-1)]">
                <div
                  className={[
                    'w-[var(--space-4)] h-[var(--space-4)] rounded-full flex items-center justify-center text-[var(--text-xs)]',
                    isCompleted && 'bg-[var(--success)] text-[color:var(--color-white)]',
                    isCurrent && 'bg-[var(--primary)] text-[var(--primary-foreground)] animate-pulse',
                    isPending && 'border-2 border-[var(--foreground-muted)] text-[color:var(--foreground-muted)]',
                  ].filter(Boolean).join(' ')}
                >
                  {isCompleted ? '✓' : isCurrent ? '●' : '○'}
                </div>
                <span className={[
                  'text-[var(--text-xs)] whitespace-nowrap',
                  isPending ? 'text-[color:var(--foreground-muted)]' : 'text-[color:var(--foreground)]',
                ].join(' ')}>
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={[
                    'flex-1 h-[2px] mx-[var(--space-1)]',
                    i < current ? 'bg-[var(--success)]' : 'bg-[var(--border)]',
                  ].join(' ')}
                  style={{ marginBottom: 'var(--space-5)' }}
                />
              )}
            </React.Fragment>
          )
        })}
      </div>

      <div className="flex flex-col gap-[var(--space-1)] text-[var(--text-sm)] text-[color:var(--foreground-secondary)]">
        {lentAt && <div>貸出日時: {lentAt}</div>}
        {returnDue && <div>返却期限: {returnDue}</div>}
        {returnedAt && <div>返却日時: {returnedAt}</div>}
      </div>
    </Card>
  )
}
