import React from 'react'
import { Icon } from '../ui/Icon'

export interface Message {
  id: string
  sender: string
  content: string
  timestamp: string
  isOwn?: boolean
}

export interface InquiryThreadProps {
  messages: Message[]
}

export const InquiryThread: React.FC<InquiryThreadProps> = ({ messages }) => {
  return (
    <div className="flex flex-col gap-3">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className="flex gap-3"
          style={{
            flexDirection: msg.isOwn ? 'row-reverse' : 'row',
          }}
        >
          <div
            className="flex items-center justify-center rounded-full shrink-0"
            style={{
              width: '2rem',
              height: '2rem',
              backgroundColor: msg.isOwn ? 'var(--primary)' : 'var(--muted)',
              color: msg.isOwn ? 'var(--primary-foreground)' : 'var(--foreground)',
            }}
          >
            <Icon name={msg.isOwn ? 'user' : 'message'} size={14} />
          </div>
          <div
            style={{
              maxWidth: '70%',
              padding: 'var(--spacing-3)',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: msg.isOwn ? 'var(--primary-light)' : 'var(--muted)',
            }}
          >
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground-secondary)', marginBottom: 'var(--spacing-1)' }}>
              {msg.sender} / {msg.timestamp}
            </div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>
              {msg.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
