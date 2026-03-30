import React from 'react'
import { Button } from '../ui/Button'

export interface ConfirmActionModalProps {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'destructive' | 'warning'
  onConfirm?: () => void
  onCancel?: () => void
  open?: boolean
}

export const ConfirmActionModal: React.FC<ConfirmActionModalProps> = ({
  title,
  message,
  confirmLabel = '実行する',
  cancelLabel = 'キャンセル',
  variant = 'destructive',
  onConfirm,
  onCancel,
  open = true,
}) => {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 50,
      }}
    >
      <div
        className="rounded-lg"
        style={{
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          padding: 'var(--spacing-6)',
          maxWidth: '28rem',
          width: '100%',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <h3
          style={{
            fontSize: 'var(--text-lg)',
            fontWeight: 'var(--font-semibold)',
            color: 'var(--foreground)',
            marginBottom: 'var(--spacing-2)',
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--foreground-secondary)',
            marginBottom: 'var(--spacing-6)',
          }}
        >
          {message}
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant={variant === 'destructive' ? 'destructive' : 'default'} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
