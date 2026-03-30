import React from 'react'

export interface PortalShellProps {
  portal: 'user' | 'owner' | 'admin'
  children: React.ReactNode
  activeNav?: string
}

const portalConfig = {
  user: { label: 'RoomConnect', color: '#2563EB', nav: ['Rooms', 'Reservations', 'Reviews', 'Support'] },
  owner: { label: 'RoomConnect Owner', color: '#0D9488', nav: ['Dashboard', 'Rooms', 'Reservations', 'Reviews', 'Settlements', 'Inquiries', 'Profile'] },
  admin: { label: 'RoomConnect Admin', color: '#475569', nav: ['Dashboard', 'Owners', 'Usage', 'Analytics', 'Settlements', 'Inquiries'] },
}

export const PortalShell: React.FC<PortalShellProps> = ({ portal, children, activeNav }) => {
  const config = portalConfig[portal]
  const hasSidebar = portal !== 'user'
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        height: '56px', backgroundColor: config.color, color: 'white',
        display: 'flex', alignItems: 'center', padding: '0 16px', gap: '16px',
      }}>
        <span style={{ fontWeight: 700, fontSize: '1.125rem' }}>{config.label}</span>
        {!hasSidebar && config.nav.map(n => (
          <button key={n} style={{
            background: 'none', border: 'none', color: n === activeNav ? 'white' : 'rgba(255,255,255,0.7)',
            cursor: 'pointer', fontSize: '0.875rem', fontWeight: n === activeNav ? 600 : 400,
          }}>{n}</button>
        ))}
      </header>
      <div style={{ display: 'flex', flex: 1 }}>
        {hasSidebar && (
          <nav style={{
            width: '256px', backgroundColor: 'var(--background)', borderRight: '1px solid var(--border)',
            padding: '16px 0',
          }}>
            {config.nav.map(n => (
              <div key={n} style={{
                padding: '8px 16px', fontSize: '0.875rem', cursor: 'pointer',
                backgroundColor: n === activeNav ? 'var(--muted)' : 'transparent',
                fontWeight: n === activeNav ? 600 : 400,
              }}>{n}</div>
            ))}
          </nav>
        )}
        <main style={{ flex: 1, padding: '24px', maxWidth: hasSidebar ? undefined : '1280px', margin: hasSidebar ? undefined : '0 auto' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
