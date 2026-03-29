import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Icon } from '@/components/ui/Icon'

/* ------------------------------------------------------------------ */
/* Types                                                                */
/* ------------------------------------------------------------------ */

type Dimension = 'all' | 'member' | 'room' | 'period'

interface UsageRecord {
  id: string
  usedAt: string
  userName: string
  userId: string
  roomName: string
  roomId: string
  durationMinutes: number
  fee: number
}

interface SortConfig {
  key: keyof UsageRecord | null
  direction: 'asc' | 'desc'
}

/* ------------------------------------------------------------------ */
/* Mock data                                                             */
/* ------------------------------------------------------------------ */

const mockRecords: UsageRecord[] = [
  { id: 'U-001', usedAt: '2026-03-01 10:00', userName: '田中 太郎', userId: 'USR-001', roomName: '渋谷A会議室', roomId: 'RM-010', durationMinutes: 120, fee: 6000 },
  { id: 'U-002', usedAt: '2026-03-02 13:00', userName: '佐藤 美咲', userId: 'USR-002', roomName: '新宿プレミアムルーム', roomId: 'RM-021', durationMinutes: 60, fee: 5000 },
  { id: 'U-003', usedAt: '2026-03-03 09:00', userName: '鈴木 健二', userId: 'USR-003', roomName: '渋谷A会議室', roomId: 'RM-010', durationMinutes: 180, fee: 9000 },
  { id: 'U-004', usedAt: '2026-03-05 15:00', userName: '伊藤 良子', userId: 'USR-004', roomName: '池袋スタジオB', roomId: 'RM-033', durationMinutes: 90, fee: 4500 },
  { id: 'U-005', usedAt: '2026-03-07 11:00', userName: '田中 太郎', userId: 'USR-001', roomName: '新宿プレミアムルーム', roomId: 'RM-021', durationMinutes: 120, fee: 10000 },
  { id: 'U-006', usedAt: '2026-03-10 14:00', userName: '山田 花子', userId: 'USR-005', roomName: '渋谷B会議室', roomId: 'RM-011', durationMinutes: 60, fee: 3000 },
  { id: 'U-007', usedAt: '2026-03-12 10:30', userName: '加藤 次郎', userId: 'USR-006', roomName: '池袋スタジオB', roomId: 'RM-033', durationMinutes: 150, fee: 7500 },
  { id: 'U-008', usedAt: '2026-03-15 13:00', userName: '中村 恵', userId: 'USR-007', roomName: '渋谷A会議室', roomId: 'RM-010', durationMinutes: 120, fee: 6000 },
]

const DIMENSION_LABELS: Record<Dimension, string> = {
  all: '全件',
  member: '会員別',
  room: '物件別',
  period: '期間別',
}

const formatDuration = (minutes: number) => {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? (m > 0 ? `${h}時間${m}分` : `${h}時間`) : `${m}分`
}

const formatCurrency = (n: number) => `¥${n.toLocaleString()}`

/* ------------------------------------------------------------------ */
/* Inner component                                                       */
/* ------------------------------------------------------------------ */

const UsageHistoryPage: React.FC = () => {
  const [dimension, setDimension] = useState<Dimension>('all')
  const [fromDate, setFromDate] = useState('2026-03-01')
  const [toDate, setToDate] = useState('2026-03-31')
  const [userQuery, setUserQuery] = useState('')
  const [roomQuery, setRoomQuery] = useState('')
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'usedAt', direction: 'asc' })
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 5

  const filtered = mockRecords.filter((r) => {
    const matchUser = userQuery === '' || r.userName.includes(userQuery) || r.userId.includes(userQuery)
    const matchRoom = roomQuery === '' || r.roomName.includes(roomQuery) || r.roomId.includes(roomQuery)
    return matchUser && matchRoom
  })

  const sorted = [...filtered].sort((a, b) => {
    if (!sortConfig.key) return 0
    const av = a[sortConfig.key]
    const bv = b[sortConfig.key]
    const cmp = av < bv ? -1 : av > bv ? 1 : 0
    return sortConfig.direction === 'asc' ? cmp : -cmp
  })

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE)
  const pageItems = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const totalFee = filtered.reduce((s, r) => s + r.fee, 0)
  const totalDuration = filtered.reduce((s, r) => s + r.durationMinutes, 0)

  const handleSort = (key: keyof UsageRecord) => {
    setSortConfig((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' }
    )
  }

  const SortArrow: React.FC<{ col: keyof UsageRecord }> = ({ col }) => {
    if (sortConfig.key !== col)
      return <span style={{ opacity: 0.3, marginLeft: 4 }}>↕</span>
    return <span style={{ marginLeft: 4 }}>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Page header */}
      <div>
        <h2
          style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--foreground)', margin: 0, marginBottom: 4 }}
        >
          利用履歴管理
        </h2>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)', margin: 0 }}>
          会員・物件・期間でフィルタリングして利用履歴を確認できます。
        </p>
      </div>

      {/* Dimension tabs */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
        {(Object.keys(DIMENSION_LABELS) as Dimension[]).map((d) => (
          <button
            key={d}
            onClick={() => { setDimension(d); setPage(1) }}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderBottom: dimension === d ? '2px solid #334155' : '2px solid transparent',
              background: 'transparent',
              fontSize: 'var(--text-sm)',
              fontWeight: dimension === d ? 'var(--font-semibold)' : 'var(--font-normal)',
              color: dimension === d ? '#334155' : 'var(--foreground-secondary)',
              cursor: 'pointer',
              transition: 'color var(--duration-normal)',
            }}
          >
            {DIMENSION_LABELS[d]}
          </button>
        ))}
      </div>

      {/* Filter area */}
      <Card>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: 12, alignItems: 'flex-end' }}>
          <Input
            label="開始日"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <Input
            label="終了日"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
          <Input
            label="利用者検索"
            placeholder="氏名 または 利用者ID"
            value={userQuery}
            onChange={(e) => { setUserQuery(e.target.value); setPage(1) }}
          />
          <Input
            label="会議室検索"
            placeholder="会議室名 または 会議室ID"
            value={roomQuery}
            onChange={(e) => { setRoomQuery(e.target.value); setPage(1) }}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="default">
              <Icon name="search" size={16} />
              検索
            </Button>
            <Button variant="secondary">
              CSVダウンロード
            </Button>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)' }}>
                {(
                  [
                    { label: '利用日時', key: 'usedAt' as keyof UsageRecord },
                    { label: '利用者名', key: 'userName' as keyof UsageRecord },
                    { label: '会議室名', key: 'roomName' as keyof UsageRecord },
                    { label: '利用時間', key: 'durationMinutes' as keyof UsageRecord },
                    { label: '利用料金', key: 'fee' as keyof UsageRecord },
                  ] as { label: string; key: keyof UsageRecord }[]
                ).map(({ label, key }) => (
                  <th
                    key={key}
                    onClick={() => handleSort(key)}
                    style={{
                      padding: '10px 12px',
                      textAlign: 'left',
                      color: 'var(--foreground-secondary)',
                      fontWeight: 'var(--font-medium)',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      userSelect: 'none',
                    }}
                  >
                    {label}
                    <SortArrow col={key} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageItems.map((r) => (
                <tr
                  key={r.id}
                  style={{ borderBottom: '1px solid var(--border)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--color-gray-100)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                >
                  <td style={{ padding: '10px 12px', color: 'var(--foreground)' }}>{r.usedAt}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--foreground)' }}>
                    {r.userName}
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground-muted)', marginLeft: 6 }}>({r.userId})</span>
                  </td>
                  <td style={{ padding: '10px 12px', color: 'var(--foreground)' }}>
                    {r.roomName}
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground-muted)', marginLeft: 6 }}>({r.roomId})</span>
                  </td>
                  <td style={{ padding: '10px 12px', color: 'var(--foreground)' }}>{formatDuration(r.durationMinutes)}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--foreground)', textAlign: 'right' }}>{formatCurrency(r.fee)}</td>
                </tr>
              ))}
            </tbody>
            {/* Summary row */}
            <tfoot>
              <tr style={{ borderTop: '2px solid var(--border)', background: 'var(--color-gray-50)' }}>
                <td style={{ padding: '10px 12px', fontWeight: 'var(--font-semibold)', color: 'var(--foreground)' }}>
                  合計 {filtered.length}件
                </td>
                <td />
                <td />
                <td style={{ padding: '10px 12px', fontWeight: 'var(--font-semibold)', color: 'var(--foreground)' }}>
                  {formatDuration(totalDuration)}
                </td>
                <td style={{ padding: '10px 12px', fontWeight: 'var(--font-semibold)', color: 'var(--foreground)', textAlign: 'right' }}>
                  {formatCurrency(totalFee)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)' }}>
            {filtered.length}件中 {(page - 1) * PAGE_SIZE + 1} - {Math.min(page * PAGE_SIZE, filtered.length)}件を表示
          </span>
          <div style={{ display: 'flex', gap: 4 }}>
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              前へ
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i + 1}
                variant={page === i + 1 ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPage(i + 1)}
                style={page === i + 1 ? { background: '#334155' } : {}}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              次へ
            </Button>
          </div>
        </div>
      </Card>

      {/* Filter badges */}
      {(userQuery || roomQuery) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)' }}>適用フィルター:</span>
          {userQuery && <Badge variant="info">利用者: {userQuery}</Badge>}
          {roomQuery && <Badge variant="info">会議室: {roomQuery}</Badge>}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Story meta                                                            */
/* ------------------------------------------------------------------ */

const meta: Meta = {
  title: 'Pages/管理者/利用履歴管理',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => {
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-portal', 'admin')
      }
      return (
        <AdminLayout pageTitle="利用履歴管理" activeNav="利用分析">
          <Story />
        </AdminLayout>
      )
    },
  ],
}

export default meta
type Story = StoryObj<typeof meta>

/* ------------------------------------------------------------------ */
/* Stories                                                              */
/* ------------------------------------------------------------------ */

export const Default: Story = {
  name: '標準（全件表示）',
  render: () => <UsageHistoryPage />,
}
