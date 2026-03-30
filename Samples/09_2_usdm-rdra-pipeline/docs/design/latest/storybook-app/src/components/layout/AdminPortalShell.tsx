import React from 'react'
import { Icon } from '../ui/Icon'
import { Badge } from '../ui/Badge'

export interface AdminPortalShellProps {
  children: React.ReactNode
  currentPage?: string
  breadcrumbs?: string[]
}

const sidebarItems = [
  { icon: 'shield-check', label: 'オーナー審査', key: 'owners' },
  { icon: 'chart', label: '手数料分析', key: 'commission' },
  { icon: 'clock', label: '利用履歴', key: 'history' },
  { icon: 'users', label: '利用状況', key: 'usage' },
  { icon: 'message', label: '問合せ対応', key: 'inquiries' },
  { icon: 'credit-card', label: '精算実行', key: 'settlements' },
]

export const AdminPortalShell: React.FC<AdminPortalShellProps> = ({
  children,
  currentPage = 'owners',
  breadcrumbs = [],
}) => {
  return (
    <div className="flex" style={{ minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      {/* Sidebar */}
      <aside
        className="flex flex-col shrink-0"
        style={{
          width: '16rem',
          borderRight: '1px solid var(--border)',
          backgroundColor: 'var(--card-bg)',
        }}
      >
        <div className="flex items-center gap-2" style={{ padding: 'var(--spacing-4)', borderBottom: '1px solid var(--border)' }}>
          <img src="/assets/logo-full.svg" alt="RoomConnect" style={{ height: '1.5rem' }} />
          <Badge variant="info">管理者</Badge>
        </div>
        <nav className="flex flex-col" style={{ padding: 'var(--spacing-2)' }}>
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              className="flex items-center gap-3 rounded-md cursor-pointer transition-colors"
              style={{
                padding: 'var(--spacing-2) var(--spacing-3)',
                background: currentPage === item.key ? 'var(--muted)' : 'none',
                border: 'none',
                color: currentPage === item.key ? 'var(--primary)' : 'var(--foreground-secondary)',
                fontSize: 'var(--text-sm)',
                fontWeight: currentPage === item.key ? 'var(--font-semibold)' : 'var(--font-normal)',
                textAlign: 'left',
                width: '100%',
              }}
            >
              <Icon name={item.icon} size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <header
          className="flex items-center justify-between"
          style={{
            height: '3.5rem',
            padding: '0 var(--spacing-6)',
            borderBottom: '1px solid var(--border)',
            backgroundColor: 'var(--card-bg)',
          }}
        >
          <div className="flex items-center gap-2" style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)' }}>
            {breadcrumbs.map((crumb, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span>/</span>}
                <span style={i === breadcrumbs.length - 1 ? { color: 'var(--foreground)', fontWeight: 'var(--font-medium)' } : undefined}>
                  {crumb}
                </span>
              </React.Fragment>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline">Production</Badge>
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
        <main className="flex-1" style={{ padding: 'var(--spacing-6)' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
