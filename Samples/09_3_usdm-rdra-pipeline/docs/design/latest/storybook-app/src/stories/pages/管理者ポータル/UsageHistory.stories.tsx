import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { PortalShell } from '../../../components/layout/PortalShell'
import { Card } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { Icon } from '../../../components/ui/Icon'

const meta: Meta = { title: 'Pages/管理者ポータル/利用履歴管理' }
export default meta

const usageData = [
  { room: 'Sakura Room', user: 'Suzuki', date: '2026-04-15', time: '10:00-12:00', status: 'Completed' },
  { room: 'Fuji Room', user: 'Tanaka', date: '2026-04-14', time: '14:00-17:00', status: 'Completed' },
  { room: 'Zen Room', user: 'Yamamoto', date: '2026-04-14', time: '09:00-11:00', status: 'Cancelled' },
  { room: 'Sakura Room', user: 'Ito', date: '2026-04-13', time: '13:00-15:00', status: 'Completed' },
]

export const Default: StoryObj = {
  render: () => (
    <PortalShell portal="admin" activeNav="Usage">
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>Usage History</h1>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--muted)' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>Room</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>User</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>Date</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>Time</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {usageData.map((d, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Icon name="room" size={16} /> {d.room}</span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Icon name="user" size={16} /> {d.user}</span>
                </td>
                <td style={{ padding: '12px 16px' }}>{d.date}</td>
                <td style={{ padding: '12px 16px' }}>{d.time}</td>
                <td style={{ padding: '12px 16px' }}>
                  <Badge variant={d.status === 'Completed' ? 'success' : 'destructive'}>{d.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PortalShell>
  ),
}
