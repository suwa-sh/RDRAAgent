import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React from 'react'
import { AdminPortalShell } from '@/components/layout/AdminPortalShell'
import { StatusBadge } from '@/components/domain/StatusBadge'
import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'

const meta: Meta = {
  title: 'Pages/Admin/利用履歴管理画面',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj

const historyData = [
  { id: 'RSV-001', user: '田中太郎', room: 'コワーキングスペース渋谷A', date: '2026-04-15 10:00-12:00', status: '利用済' },
  { id: 'RSV-002', user: '佐藤花子', room: '新宿ミーティングルームB', date: '2026-04-14 14:00-16:00', status: '利用済' },
  { id: 'RSV-003', user: '鈴木一郎', room: '六本木カンファレンスC', date: '2026-04-20 09:00-17:00', status: '予約確定' },
  { id: 'RSV-004', user: '高橋次郎', room: '品川セミナールームD', date: '2026-04-18 13:00-15:00', status: '取消済' },
]

export const Default: Story = {
  render: () => (
    <AdminPortalShell currentPage="history" breadcrumbs={['利用履歴']}>
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-6)' }}>
        利用履歴を管理する
      </h1>
      <Card>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--muted)', textAlign: 'left' }}>
                <th style={{ padding: 'var(--spacing-3)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--foreground)' }}>予約ID</th>
                <th style={{ padding: 'var(--spacing-3)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--foreground)' }}>利用者</th>
                <th style={{ padding: 'var(--spacing-3)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--foreground)' }}>会議室</th>
                <th style={{ padding: 'var(--spacing-3)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--foreground)' }}>利用日時</th>
                <th style={{ padding: 'var(--spacing-3)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--foreground)' }}>状態</th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((row) => (
                <tr key={row.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: 'var(--spacing-3)', fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>{row.id}</td>
                  <td style={{ padding: 'var(--spacing-3)', fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>{row.user}</td>
                  <td style={{ padding: 'var(--spacing-3)', fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>{row.room}</td>
                  <td style={{ padding: 'var(--spacing-3)', fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>{row.date}</td>
                  <td style={{ padding: 'var(--spacing-3)' }}><StatusBadge status={row.status} model="reservation" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AdminPortalShell>
  ),
}
