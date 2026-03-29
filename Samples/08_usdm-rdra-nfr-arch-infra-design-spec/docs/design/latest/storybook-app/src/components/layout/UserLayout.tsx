import React from 'react'
import { Button } from '../ui/Button'
import { Icon } from '../ui/Icon'

export interface UserLayoutProps {
  children: React.ReactNode
  currentPage?: 'search' | 'reservations' | 'inquiry' | 'mypage'
  userName?: string
  onNavigate?: (page: string) => void
}

const navItems = [
  { id: 'search',       label: '会議室検索', icon: 'search'   as const },
  { id: 'reservations', label: '予約一覧',   icon: 'calendar' as const },
  { id: 'inquiry',      label: '問合せ',     icon: 'message'  as const },
  { id: 'mypage',       label: 'マイページ', icon: 'user'     as const },
]

export const UserLayout: React.FC<UserLayoutProps> = ({
  children,
  currentPage = 'search',
  userName = '田中太郎',
  onNavigate,
}) => {
  const portalPrimary = '#2563EB'

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'var(--background)', color: 'var(--foreground)' }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          background: 'var(--background)',
          borderColor: 'var(--border)',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        <div
          className="flex items-center justify-between h-16 px-[var(--space-6)]"
          style={{ maxWidth: '1280px', margin: '0 auto', width: '100%' }}
        >
          {/* Logo */}
          <a
            href="/"
            className="flex items-center shrink-0"
            style={{ textDecoration: 'none' }}
            aria-label="RoomConnect ホーム"
          >
            <img
              src="/assets/logo-full.svg"
              alt="RoomConnect"
              height={32}
              style={{ height: '32px', width: 'auto' }}
            />
          </a>

          {/* Primary Navigation */}
          <nav className="hidden md:flex items-center gap-[var(--space-1)]" aria-label="メインナビゲーション">
            {navItems.map((item) => {
              const isActive = currentPage === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate?.(item.id)}
                  className="flex items-center gap-[var(--space-2)] h-10 px-[var(--space-4)] rounded-[var(--radius-lg)] text-[var(--text-sm)] font-[var(--font-medium)] transition-colors"
                  style={{
                    background: isActive ? 'var(--primary-light)' : 'transparent',
                    color: isActive ? portalPrimary : 'var(--foreground-secondary)',
                    fontWeight: isActive ? 'var(--font-semibold)' : 'var(--font-medium)',
                  }}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon name={item.icon} size={16} />
                  {item.label}
                </button>
              )
            })}
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-[var(--space-2)]">
            <Button variant="ghost" size="sm" className="hidden md:inline-flex items-center gap-[var(--space-2)]">
              <Icon name="user" size={16} />
              <span className="text-[var(--text-sm)]" style={{ color: 'var(--foreground)' }}>
                {userName}
              </span>
            </Button>
            {/* Mobile hamburger placeholder */}
            <button
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-[var(--radius-lg)] hover:bg-[var(--muted)] transition-colors"
              style={{ color: 'var(--foreground)' }}
              aria-label="メニューを開く"
            >
              <Icon name="settings" size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-[var(--space-8)]">
        <div
          className="px-[var(--space-6)]"
          style={{ maxWidth: '1280px', margin: '0 auto', width: '100%' }}
        >
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer
        className="border-t py-[var(--space-6)]"
        style={{ borderColor: 'var(--border)', background: 'var(--background-secondary)' }}
      >
        <div
          className="px-[var(--space-6)] flex flex-col md:flex-row items-center justify-between gap-[var(--space-2)]"
          style={{ maxWidth: '1280px', margin: '0 auto', width: '100%' }}
        >
          <img
            src="/assets/logo-full.svg"
            alt="RoomConnect"
            height={24}
            style={{ height: '24px', width: 'auto', opacity: 0.6 }}
          />
          <p
            className="text-[var(--text-xs)]"
            style={{ color: 'var(--foreground-muted)' }}
          >
            &copy; 2026 RoomConnect Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
