import React from 'react'

export interface ProcessingStateProps {
  message: string
  progress?: number
}

export const ProcessingState: React.FC<ProcessingStateProps> = ({ message, progress }) => (
  <div style={{ textAlign: 'center', padding: '48px 24px' }}>
    <div style={{
      width: '48px', height: '48px', border: '4px solid var(--border)',
      borderTopColor: 'var(--primary)', borderRadius: '50%',
      margin: '0 auto 16px', animation: 'spin 1s linear infinite',
    }} />
    <p style={{ fontSize: '0.875rem', color: 'var(--foreground)', fontWeight: 500 }}>{message}</p>
    {progress !== undefined && (
      <div style={{ maxWidth: '200px', margin: '12px auto 0', backgroundColor: 'var(--muted)', borderRadius: '4px', height: '6px' }}>
        <div style={{ width: `${progress}%`, backgroundColor: 'var(--primary)', height: '100%', borderRadius: '4px', transition: 'width 0.3s ease' }} />
      </div>
    )}
  </div>
)
