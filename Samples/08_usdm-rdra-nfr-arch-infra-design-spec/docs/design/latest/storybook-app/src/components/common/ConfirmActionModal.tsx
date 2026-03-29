import React, { useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export interface ConfirmActionModalProps {
  isOpen: boolean
  title: string
  description: string
  confirmLabel: string
  cancelLabel?: string
  variant?: 'default' | 'destructive'
  onConfirm: () => void
  onCancel: () => void
  isProcessing?: boolean
}

export const ConfirmActionModal: React.FC<ConfirmActionModalProps> = ({
  isOpen,
  title,
  description,
  confirmLabel,
  cancelLabel = 'キャンセル',
  variant = 'default',
  onConfirm,
  onCancel,
  isProcessing = false,
}) => {
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isProcessing) onCancel()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, isProcessing, onCancel])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-4)',
        background: 'var(--modal-backdrop)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isProcessing) onCancel()
      }}
    >
      <div style={{ width: '100%', maxWidth: 'var(--modal-width-sm)' }}>
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div>
              <p
                id="confirm-modal-title"
                style={{
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-semibold)',
                  color: 'var(--foreground)',
                  marginBottom: 'var(--space-2)',
                }}
              >
                {title}
              </p>
              <p
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--foreground-secondary)',
                  lineHeight: 'var(--leading-relaxed)',
                }}
              >
                {description}
              </p>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 'var(--space-3)',
                paddingTop: 'var(--space-2)',
                borderTop: '1px solid var(--border)',
              }}
            >
              <Button
                variant="ghost"
                size="md"
                onClick={onCancel}
                disabled={isProcessing}
              >
                {cancelLabel}
              </Button>
              <Button
                variant={variant === 'destructive' ? 'destructive' : 'default'}
                size="md"
                onClick={onConfirm}
                loading={isProcessing}
                disabled={isProcessing}
              >
                {confirmLabel}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
