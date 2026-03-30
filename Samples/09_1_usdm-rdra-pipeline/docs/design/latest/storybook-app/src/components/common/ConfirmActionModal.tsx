import React from 'react'

export interface ConfirmActionModalProps {
  open: boolean
  title: string
  message: string
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
  variant?: 'default' | 'destructive'
}

export const ConfirmActionModal: React.FC<ConfirmActionModalProps> = ({
  open,
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
  variant = 'default',
}) => {
  if (!open) return null

  const confirmBg = variant === 'destructive' ? 'var(--destructive)' : 'var(--primary)'
  const confirmColor = 'var(--primary-foreground)'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div
        className="rounded-xl p-6 w-full max-w-md mx-4"
        style={{
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
          {title}
        </h3>
        <p className="text-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>
          {message}
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md text-sm font-medium"
            style={{
              backgroundColor: 'var(--muted)',
              color: 'var(--foreground)',
            }}
          >
            キャンセル
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md text-sm font-medium"
            style={{
              backgroundColor: confirmBg,
              color: confirmColor,
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
