import React from 'react'
import { Icon } from '../ui/Icon'

export interface UserPortalShellProps {
  children: React.ReactNode
  currentPage?: string
}

const navItems = [
  { icon: 'search', label: '会議室検索', key: 'search' },
  { icon: 'calendar', label: '予約一覧', key: 'reservations' },
  { icon: 'message', label: '問合せ', key: 'inquiries' },
  { icon: 'user', label: 'マイページ', key: 'mypage' },
]

export const UserPortalShell: React.FC<UserPortalShellProps> = ({
  children,
  currentPage = 'search',
}) => {
  return (
    <div className="flex flex-col" style={{ minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <header
        className="flex items-center justify-between"
        style={{
          height: '3.5rem',
          padding: '0 var(--spacing-4)',
          borderBottom: '1px solid var(--border)',
          backgroundColor: 'var(--card-bg)',
        }}
      >
        <div className="flex items-center gap-2">
          <img src="/assets/logo-icon.svg" alt="RoomConnect" style={{ height: '1.5rem' }} />
          <span style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', color: 'var(--foreground)' }}>
            RoomConnect
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="flex items-center justify-center rounded-full cursor-pointer"
            style={{
              width: '2rem', height: '2rem',
              backgroundColor: 'var(--muted)',
              border: 'none',
            }}
          >
            <Icon name="user" size={16} />
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1" style={{ padding: 'var(--spacing-4)', maxWidth: '64rem', margin: '0 auto', width: '100%' }}>
        {children}
      </main>

      {/* Bottom navigation (mobile) */}
      <nav
        className="flex items-center justify-around"
        style={{
          height: '3.5rem',
          borderTop: '1px solid var(--border)',
          backgroundColor: 'var(--card-bg)',
        }}
      >
        {navItems.map((item) => (
          <button
            key={item.key}
            className="flex flex-col items-center gap-0.5 cursor-pointer"
            style={{
              background: 'none',
              border: 'none',
              padding: '0.25rem 0.5rem',
              color: currentPage === item.key ? 'var(--primary)' : 'var(--foreground-secondary)',
              fontSize: 'var(--text-xs)',
            }}
          >
            <Icon name={item.icon} size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
