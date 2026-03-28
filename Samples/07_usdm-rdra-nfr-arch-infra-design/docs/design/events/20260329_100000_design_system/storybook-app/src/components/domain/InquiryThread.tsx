import React from 'react'
import { Card } from '../ui/Card'

export interface Message {
  id: string
  sender: string
  senderRole: 'user' | 'owner' | 'admin'
  content: string
  timestamp: string
}

export interface InquiryThreadProps {
  messages: Message[]
  onSend?: (message: string) => void
}

const roleStyles: Record<string, { align: string; bg: string }> = {
  user:  { align: 'items-start', bg: 'var(--info-light)' },
  owner: { align: 'items-end',   bg: 'var(--success-light)' },
  admin: { align: 'items-end',   bg: 'var(--muted)' },
}

export const InquiryThread: React.FC<InquiryThreadProps> = ({ messages, onSend }) => {
  const [draft, setDraft] = React.useState('')

  return (
    <Card className="flex flex-col gap-[var(--space-4)]">
      <div className="flex flex-col gap-[var(--space-3)] max-h-[400px] overflow-y-auto">
        {messages.map((msg) => {
          const style = roleStyles[msg.senderRole]
          return (
            <div key={msg.id} className={`flex flex-col ${style.align}`}>
              <div className="flex items-center gap-[var(--space-2)] mb-[var(--space-1)]">
                <div
                  className="w-[var(--avatar-size-sm)] h-[var(--avatar-size-sm)] rounded-[var(--avatar-radius)] bg-[var(--muted)] flex items-center justify-center text-[var(--text-xs)] font-[var(--font-medium)]"
                >
                  {msg.sender[0]}
                </div>
                <span className="text-[var(--text-sm)] font-[var(--font-medium)] text-[color:var(--foreground)]">{msg.sender}</span>
                <span className="text-[var(--text-xs)] text-[color:var(--foreground-muted)]">{msg.timestamp}</span>
              </div>
              <div
                className="rounded-[var(--radius-lg)] px-[var(--space-4)] py-[var(--space-3)] max-w-[80%] text-[var(--text-sm)] text-[color:var(--foreground)]"
                style={{ background: style.bg }}
              >
                {msg.content}
              </div>
            </div>
          )
        })}
      </div>

      {onSend && (
        <div className="flex gap-[var(--space-2)] border-t border-[var(--border)] pt-[var(--space-3)]">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="メッセージを入力..."
            className="flex-1 h-[var(--input-height)] px-[var(--input-px)] rounded-[var(--input-radius)] border border-[var(--input-border)] text-[var(--input-font-size)] bg-[var(--background)] text-[color:var(--foreground)] placeholder:text-[color:var(--foreground-muted)] focus:outline-2 focus:outline-[var(--input-focus-ring)]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && draft.trim()) {
                onSend(draft)
                setDraft('')
              }
            }}
          />
          <button
            onClick={() => { if (draft.trim()) { onSend(draft); setDraft('') } }}
            className="h-[var(--input-height)] px-[var(--space-4)] rounded-[var(--button-radius)] bg-[var(--primary)] text-[var(--primary-foreground)] text-[var(--text-sm)] font-[var(--button-font-weight)] hover:bg-[var(--primary-hover)] transition-colors"
          >
            送信
          </button>
        </div>
      )}
    </Card>
  )
}
