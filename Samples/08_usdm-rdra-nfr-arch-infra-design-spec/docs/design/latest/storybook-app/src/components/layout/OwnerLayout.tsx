'use client'
import React, { useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import { Badge } from '@/components/ui/Badge'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface OwnerLayoutProps {
  children: React.ReactNode
  breadcrumbs?: BreadcrumbItem[]
  notificationCount?: number
  userName?: string
}

const NAV_ITEMS: { icon: React.ReactNode; label: string; href: string }[] = [
  {
    icon: (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
    label: 'ダッシュボード',
    href: '/owner',
  },
  {
    icon: <Icon name="room" size={20} />,
    label: '会議室管理',
    href: '/owner/rooms',
  },
  {
    icon: <Icon name="calendar" size={20} />,
    label: '予約管理',
    href: '/owner/reservations',
  },
  {
    icon: <Icon name="credit-card" size={20} />,
    label: '精算',
    href: '/owner/settlements',
  },
  {
    icon: <Icon name="star" size={20} />,
    label: '評価',
    href: '/owner/reviews',
  },
  {
    icon: <Icon name="message" size={20} />,
    label: '問合せ',
    href: '/owner/inquiries',
  },
]

const PRIMARY = '#0D9488'
const PRIMARY_HOVER = '#0F766E'
const PRIMARY_LIGHT = '#F0FDFA'

export const OwnerLayout: React.FC<OwnerLayoutProps> = ({
  children,
  breadcrumbs = [],
  notificationCount = 0,
  userName = '山田 花子',
}) => {
  const [collapsed, setCollapsed] = useState(false)
  const sidebarWidth = collapsed ? 64 : 240

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--background-secondary)' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: sidebarWidth,
          minWidth: sidebarWidth,
          background: 'var(--card-bg)',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width var(--duration-normal)',
          overflow: 'hidden',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 20,
        }}
      >
        {/* Logo area */}
        <div
          style={{
            height: 56,
            display: 'flex',
            alignItems: 'center',
            padding: collapsed ? '0 12px' : '0 16px',
            borderBottom: '1px solid var(--border)',
            gap: 10,
            flexShrink: 0,
          }}
        >
          <img
            src="/assets/logo-icon.svg"
            alt="RoomConnect"
            width={32}
            height={32}
            style={{ flexShrink: 0 }}
          />
          {!collapsed && (
            <span
              style={{
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-bold)',
                color: PRIMARY,
                whiteSpace: 'nowrap',
              }}
            >
              RoomConnect
            </span>
          )}
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                height: 40,
                padding: collapsed ? '0 10px' : '0 12px',
                borderRadius: 'var(--radius-lg)',
                color: 'var(--foreground-secondary)',
                textDecoration: 'none',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-medium)',
                whiteSpace: 'nowrap',
                transition: 'background var(--duration-fast)',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.background = PRIMARY_LIGHT
                ;(e.currentTarget as HTMLAnchorElement).style.color = PRIMARY
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.background = 'transparent'
                ;(e.currentTarget as HTMLAnchorElement).style.color = 'var(--foreground-secondary)'
              }}
            >
              <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                {item.icon}
              </span>
              {!collapsed && <span>{item.label}</span>}
            </a>
          ))}
        </nav>

        {/* Collapse toggle */}
        <div style={{ padding: '8px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
          <button
            onClick={() => setCollapsed((c) => !c)}
            style={{
              width: '100%',
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'flex-end',
              paddingRight: collapsed ? 0 : 8,
              background: 'transparent',
              border: 'none',
              borderRadius: 'var(--radius-lg)',
              color: 'var(--foreground-muted)',
              cursor: 'pointer',
            }}
            aria-label={collapsed ? 'サイドバーを展開' : 'サイドバーを折りたたむ'}
          >
            <svg
              width={16}
              height={16}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform var(--duration-normal)' }}
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Header */}
        <header
          style={{
            height: 56,
            background: 'var(--card-bg)',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 24px',
            gap: 16,
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          {/* Breadcrumbs */}
          <nav style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 4 }}>
            {breadcrumbs.map((crumb, i) => (
              <React.Fragment key={i}>
                {i > 0 && (
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--foreground-muted)', flexShrink: 0 }}>
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                )}
                {crumb.href && i < breadcrumbs.length - 1 ? (
                  <a
                    href={crumb.href}
                    style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--foreground-secondary)',
                      textDecoration: 'none',
                    }}
                  >
                    {crumb.label}
                  </a>
                ) : (
                  <span
                    style={{
                      fontSize: 'var(--text-sm)',
                      color: i === breadcrumbs.length - 1 ? 'var(--foreground)' : 'var(--foreground-secondary)',
                      fontWeight: i === breadcrumbs.length - 1 ? 'var(--font-medium)' : 'var(--font-normal)',
                    }}
                  >
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>

          {/* Notification bell */}
          <button
            style={{
              position: 'relative',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              borderRadius: 'var(--radius-lg)',
              color: 'var(--foreground-secondary)',
              cursor: 'pointer',
            }}
            aria-label="通知"
          >
            <Icon name="message" size={20} />
            {notificationCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  minWidth: 16,
                  height: 16,
                  background: PRIMARY,
                  color: '#fff',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 10,
                  fontWeight: 'var(--font-bold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 3px',
                }}
              >
                {notificationCount > 99 ? '99+' : notificationCount}
              </span>
            )}
          </button>

          {/* User menu */}
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '0 12px',
              height: 36,
              background: 'transparent',
              border: 'none',
              borderRadius: 'var(--radius-lg)',
              cursor: 'pointer',
              color: 'var(--foreground)',
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 'var(--radius-full)',
                background: PRIMARY_LIGHT,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Icon name="user" size={16} />
            </div>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', whiteSpace: 'nowrap' }}>
              {userName}
            </span>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </header>

        {/* Main content */}
        <main style={{ flex: 1, padding: 24, minWidth: 0 }}>
          {children}
        </main>
      </div>
    </div>
  )
}
