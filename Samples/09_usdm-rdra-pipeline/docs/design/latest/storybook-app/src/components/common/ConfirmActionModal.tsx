import React from 'react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

export interface ConfirmActionModalProps {
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
  variant?: 'default' | 'destructive'
  open?: boolean
}

export const ConfirmActionModal: React.FC<ConfirmActionModalProps> = ({
  title, message, confirmLabel = 'OK', onConfirm, onCancel, variant = 'default', open = true,
}) => {
  if (!open) return null
  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
    }}>
      <Card style={{ maxWidth: '480px', width: '100%', padding: '24px' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '8px' }}>{title}</h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '24px' }}>{message}</p>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button variant={variant} onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </Card>
    </div>
  )
}
