import React from 'react'
import { Icon } from '@/components/ui/Icon'

export interface AdminNavItem {
  label: string
  href: string
  iconName: 'chart' | 'users' | 'settings' | 'credit-card' | 'message' | 'shield-check'
  active?: boolean
  badgeCount?: number
}

export interface AdminLayoutProps {
  children: React.ReactNode
  pageTitle?: string
  activeNav?: string
}

const navItems: AdminNavItem[] = [
  { label: 'ダッシュボード', href: '/admin', iconName: 'chart' },
  { label: 'オーナー管理', href: '/admin/owners', iconName: 'users' },
  { label: '利用分析', href: '/admin/analytics', iconName: 'chart' },
  { label: '精算管理', href: '/admin/settlements', iconName: 'credit-card' },
  { label: '問合せ', href: '/admin/inquiries', iconName: 'message' },
]

const ADMIN_PRIMARY = '#334155'
const ADMIN_PRIMARY_HOVER = '#1E293B'
const SIDEBAR_WIDTH = 240

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  pageTitle = '管理者ポータル',
  activeNav,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'var(--background-secondary)',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: SIDEBAR_WIDTH,
          minWidth: SIDEBAR_WIDTH,
          background: ADMIN_PRIMARY,
          display: 'flex',
          flexDirection: 'column',
          paddingTop: 'var(--space-6)',
          paddingBottom: 'var(--space-6)',
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            paddingLeft: 'var(--space-5)',
            paddingRight: 'var(--space-5)',
            marginBottom: 'var(--space-8)',
          }}
        >
          <img
            src="/assets/logo-icon.svg"
            alt="RoomConnect"
            style={{ width: 32, height: 32 }}
          />
          <span
            style={{
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--font-semibold)',
              color: '#FFFFFF',
              letterSpacing: '0.01em',
            }}
          >
            管理者ポータル
          </span>
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', paddingLeft: 'var(--space-3)', paddingRight: 'var(--space-3)' }}>
          {navItems.map((item) => {
            const isActive = activeNav === item.href || activeNav === item.label
            return (
              <a
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  height: 'var(--sidebar-item-height)',
                  paddingLeft: 'var(--sidebar-item-padding)',
                  paddingRight: 'var(--sidebar-item-padding)',
                  borderRadius: 'var(--sidebar-item-radius)',
                  textDecoration: 'none',
                  fontSize: 'var(--text-sm)',
                  fontWeight: isActive ? 'var(--font-semibold)' : 'var(--font-normal)',
                  color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.7)',
                  background: isActive ? ADMIN_PRIMARY_HOVER : 'transparent',
                  transition: 'background var(--duration-normal), color var(--duration-normal)',
                }}
              >
                <Icon name={item.iconName} size={18} />
                <span>{item.label}</span>
                {item.badgeCount !== undefined && item.badgeCount > 0 && (
                  <span
                    style={{
                      marginLeft: 'auto',
                      minWidth: 20,
                      height: 20,
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--color-red-500)',
                      color: '#FFFFFF',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-bold)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingLeft: 'var(--space-1)',
                      paddingRight: 'var(--space-1)',
                    }}
                  >
                    {item.badgeCount}
                  </span>
                )}
              </a>
            )
          })}
        </nav>

        {/* Bottom spacer + settings */}
        <div style={{ marginTop: 'auto', paddingLeft: 'var(--space-3)', paddingRight: 'var(--space-3)' }}>
          <a
            href="/admin/settings"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              height: 'var(--sidebar-item-height)',
              paddingLeft: 'var(--sidebar-item-padding)',
              paddingRight: 'var(--sidebar-item-padding)',
              borderRadius: 'var(--sidebar-item-radius)',
              textDecoration: 'none',
              fontSize: 'var(--text-sm)',
              color: 'rgba(255,255,255,0.6)',
            }}
          >
            <Icon name="settings" size={18} />
            <span>設定</span>
          </a>
        </div>
      </aside>

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Header */}
        <header
          style={{
            height: 56,
            background: 'var(--background)',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 'var(--space-6)',
            paddingRight: 'var(--space-6)',
            gap: 'var(--space-4)',
          }}
        >
          <h1
            style={{
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-semibold)',
              color: 'var(--foreground)',
              flex: 1,
            }}
          >
            {pageTitle}
          </h1>
          {/* Admin user badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
            }}
          >
            <Icon name="shield-check" size={16} />
            <span
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--foreground-secondary)',
              }}
            >
              山田花子（管理者）
            </span>
            <div
              style={{
                width: 'var(--avatar-size-sm)',
                height: 'var(--avatar-size-sm)',
                borderRadius: 'var(--avatar-radius)',
                background: ADMIN_PRIMARY,
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-semibold)',
              }}
            >
              山
            </div>
          </div>
        </header>

        {/* Page content */}
        <main
          style={{
            flex: 1,
            padding: 'var(--space-6)',
            overflowY: 'auto',
          }}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
