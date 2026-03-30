import React from 'react'
import { Icon } from '../ui/Icon'

export interface Message {
  id: string
  sender: string
  content: string
  timestamp: string
  isReply?: boolean
}

export interface InquiryThreadProps {
  subject: string
  messages: Message[]
}

export const InquiryThread: React.FC<InquiryThreadProps> = ({
  subject,
  messages,
}) => {
  return (
    <div
      style={{
        padding: '1.5rem',
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '1rem' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <Icon name="message" size={18} />
          {subject}
        </span>
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: msg.isReply ? 'var(--primary-light)' : 'var(--muted)',
              borderLeft: msg.isReply ? '3px solid var(--primary)' : '3px solid var(--border)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--foreground)' }}>
                {msg.sender}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--foreground-secondary)' }}>
                {msg.timestamp}
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--foreground)', margin: 0, lineHeight: 1.5 }}>
              {msg.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
