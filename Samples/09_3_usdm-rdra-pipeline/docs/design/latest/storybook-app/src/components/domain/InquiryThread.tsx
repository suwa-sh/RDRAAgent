import React from 'react'
import { Icon } from '../ui/Icon'
import { Button } from '../ui/Button'

export interface Message {
  id: string
  sender: string
  content: string
  timestamp: string
  isOwn?: boolean
}

export interface InquiryThreadProps {
  messages: Message[]
  onSend?: (content: string) => void
}

export const InquiryThread: React.FC<InquiryThreadProps> = ({ messages, onSend }) => {
  const [input, setInput] = React.useState('')

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 max-h-80 overflow-y-auto p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
            <div
              className="max-w-xs rounded-lg px-3 py-2"
              style={{
                backgroundColor: msg.isOwn ? 'var(--primary)' : 'var(--card-bg)',
                color: msg.isOwn ? 'var(--primary-foreground)' : 'var(--foreground)',
                border: msg.isOwn ? 'none' : '1px solid var(--border)',
              }}
            >
              <div className="text-xs mb-1" style={{ opacity: 0.7 }}>{msg.sender}</div>
              <div className="text-sm">{msg.content}</div>
              <div className="text-xs mt-1" style={{ opacity: 0.5 }}>{msg.timestamp}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 min-w-0 rounded-lg px-3 py-2 text-sm outline-none"
          style={{
            backgroundColor: 'var(--background)',
            color: 'var(--foreground)',
            border: '1px solid var(--border)',
          }}
          placeholder="メッセージを入力..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && input.trim()) {
              onSend?.(input)
              setInput('')
            }
          }}
        />
        <Button variant="default" onClick={() => { if (input.trim()) { onSend?.(input); setInput('') } }}>
          <Icon name="message" size={16} />
        </Button>
      </div>
    </div>
  )
}
