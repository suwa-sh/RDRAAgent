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

type Dimension = 'period' | 'room' | 'member'

interface KPIData {
  totalUsageCount: number
  totalRevenue: number
  averageOccupancy: number
  activeUsers: number
  countGrowth: number
  revenueGrowth: number
}

interface TrendItem {
  month: string
  count: number
  revenue: number
}

interface RoomOccupancy {
  roomName: string
  occupancyRate: number
}

interface RoomDetail {
  roomName: string
  count: number
  revenue: number
  occupancyRate: number
}

/* ------------------------------------------------------------------ */
/* Mock data                                                             */
/* ------------------------------------------------------------------ */

const mockKPI: KPIData = {
  totalUsageCount: 342,
  totalRevenue: 1_842_000,
  averageOccupancy: 68.4,
  activeUsers: 127,
  countGrowth: 12.5,
  revenueGrowth: 8.3,
}

const mockTrend: TrendItem[] = [
  { month: '2025-10', count: 210, revenue: 1_120_000 },
  { month: '2025-11', count: 235, revenue: 1_260_000 },
  { month: '2025-12', count: 198, revenue: 1_050_000 },
  { month: '2026-01', count: 280, revenue: 1_500_000 },
  { month: '2026-02', count: 304, revenue: 1_700_000 },
  { month: '2026-03', count: 342, revenue: 1_842_000 },
]

const mockRoomOccupancy: RoomOccupancy[] = [
  { roomName: '渋谷A会議室', occupancyRate: 87.2 },
  { roomName: '新宿プレミアムルーム', occupancyRate: 78.5 },
  { roomName: '渋谷B会議室', occupancyRate: 65.1 },
  { roomName: '池袋スタジオB', occupancyRate: 54.3 },
  { roomName: '品川コンファレンスC', occupancyRate: 42.0 },
  { roomName: '上野ミーティングルーム', occupancyRate: 31.5 },
]

const mockRoomDetails: RoomDetail[] = [
  { roomName: '渋谷A会議室', count: 98, revenue: 588_000, occupancyRate: 87.2 },
  { roomName: '新宿プレミアムルーム', count: 76, revenue: 760_000, occupancyRate: 78.5 },
  { roomName: '渋谷B会議室', count: 65, revenue: 325_000, occupancyRate: 65.1 },
  { roomName: '池袋スタジオB', count: 58, revenue: 290_000, occupancyRate: 54.3 },
  { roomName: '品川コンファレンスC', count: 32, revenue: 160_000, occupancyRate: 42.0 },
  { roomName: '上野ミーティングルーム', count: 13, revenue: 65_000, occupancyRate: 31.5 },
]

const formatCurrency = (n: number) => `¥${n.toLocaleString()}`

/* ------------------------------------------------------------------ */
/* Sub components                                                        */
/* ------------------------------------------------------------------ */

const KPICard: React.FC<{
  label: string
  value: string
  growth?: number
  iconName: 'chart' | 'credit-card' | 'room' | 'users'
}> = ({ label, value, growth, iconName }) => (
  <Card>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)' }}>{label}</span>
      <Icon name={iconName} size={18} />
    </div>
    <div style={{ fontSize: 'var(--text-2xl, 1.5rem)', fontWeight: 'var(--font-bold)', color: 'var(--foreground)', marginBottom: 4 }}>
      {value}
    </div>
    {growth !== undefined && (
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <svg
          width={14}
          height={14}
          viewBox="0 0 24 24"
          fill="none"
          stroke={growth >= 0 ? '#16A34A' : '#DC2626'}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {growth >= 0
            ? <polyline points="18 15 12 9 6 15" />
            : <polyline points="6 9 12 15 18 9" />}
        </svg>
        <span
          style={{
            fontSize: 'var(--text-xs)',
            color: growth >= 0 ? '#16A34A' : '#DC2626',
            fontWeight: 'var(--font-medium)',
          }}
        >
          前期比 {growth >= 0 ? '+' : ''}{growth}%
        </span>
      </div>
    )}
  </Card>
)

const TrendChart: React.FC<{ data: TrendItem[] }> = ({ data }) => {
  const maxRevenue = Math.max(...data.map((d) => d.revenue))
  const maxCount = Math.max(...data.map((d) => d.count))

  return (
    <div>
      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)', marginBottom: 12, display: 'flex', gap: 16 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 24, height: 2, background: '#2563EB', display: 'inline-block' }} />
          利用回数（左軸）
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 14, height: 14, background: '#0D9488', display: 'inline-block', borderRadius: 2 }} />
          売上金額（右軸）
        </span>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 180 }}>
        {data.map((item) => (
          <div key={item.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 2, width: '100%' }}>
              {/* Revenue bar */}
              <div
                style={{
                  flex: 1,
                  background: '#0D9488',
                  height: `${(item.revenue / maxRevenue) * 100}%`,
                  borderRadius: '2px 2px 0 0',
                  opacity: 0.85,
                  minHeight: 4,
                }}
                title={`${item.month}: ${formatCurrency(item.revenue)}`}
              />
              {/* Count line indicator (dot) */}
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#2563EB',
                  border: '2px solid white',
                  boxShadow: '0 0 0 1px #2563EB',
                  marginBottom: `calc(${(item.count / maxCount) * 100}% - 8px)`,
                  alignSelf: 'flex-end',
                  flexShrink: 0,
                }}
                title={`${item.month}: ${item.count}件`}
              />
            </div>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground-muted)', whiteSpace: 'nowrap' }}>
              {item.month.slice(5)}月
            </span>
          </div>
        ))}
      </div>
      <div style={{ borderTop: '1px solid var(--border)', marginTop: 8 }} />
    </div>
  )
}

const OccupancyChart: React.FC<{ data: RoomOccupancy[] }> = ({ data }) => {
  const getColor = (rate: number) =>
    rate >= 80 ? '#16A34A' : rate >= 50 ? '#2563EB' : '#F59E0B'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {data.map((item) => (
        <div key={item.roomName} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span
            style={{
              width: 160,
              fontSize: 'var(--text-sm)',
              color: 'var(--foreground)',
              flexShrink: 0,
              textAlign: 'right',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {item.roomName}
          </span>
          <div style={{ flex: 1, height: 22, background: 'var(--color-gray-100)', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${item.occupancyRate}%`,
                background: getColor(item.occupancyRate),
                borderRadius: 4,
                transition: 'width 0.4s ease',
              }}
            />
            {/* 50% threshold line */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                width: 1,
                height: '100%',
                background: 'rgba(0,0,0,0.25)',
                borderLeft: '1px dashed rgba(0,0,0,0.3)',
              }}
            />
          </div>
          <span
            style={{
              width: 48,
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-semibold)',
              color: getColor(item.occupancyRate),
              flexShrink: 0,
            }}
          >
            {item.occupancyRate.toFixed(1)}%
          </span>
        </div>
      ))}
      <div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
        {[
          { color: '#16A34A', label: '80%以上' },
          { color: '#2563EB', label: '50-80%' },
          { color: '#F59E0B', label: '50%未満' },
        ].map(({ color, label }) => (
          <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-xs)', color: 'var(--foreground-secondary)' }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: color, display: 'inline-block' }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Main page component                                                   */
/* ------------------------------------------------------------------ */

const UsageAnalyticsPage: React.FC<{ initialDimension?: Dimension }> = ({
  initialDimension = 'period',
}) => {
  const [dimension, setDimension] = useState<Dimension>(initialDimension)
  const [fromDate, setFromDate] = useState('2025-10-01')
  const [toDate, setToDate] = useState('2026-03-31')

  const DIMENSION_LABELS: Record<Dimension, string> = {
    period: '期間別',
    room: '物件別',
    member: '会員別',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Page header */}
      <div>
        <h2
          style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--foreground)', margin: 0, marginBottom: 4 }}
        >
          利用状況分析
        </h2>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)', margin: 0 }}>
          集計期間・集計軸を選択して利用状況を多角的に分析できます。
        </p>
      </div>

      {/* Filter area */}
      <Card>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--foreground)' }}>
              集計軸
            </label>
            <select
              value={dimension}
              onChange={(e) => setDimension(e.target.value as Dimension)}
              style={{
                height: 'var(--input-height)',
                paddingLeft: 'var(--input-px)',
                paddingRight: 'var(--input-px)',
                borderRadius: 'var(--input-radius)',
                border: '1px solid var(--input-border)',
                fontSize: 'var(--input-font-size)',
                background: 'var(--background)',
                color: 'var(--foreground)',
              }}
            >
              {(Object.entries(DIMENSION_LABELS) as [Dimension, string][]).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <Input label="集計開始日" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          <Input label="集計終了日" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          <Button variant="default">
            <Icon name="chart" size={16} />
            分析実行
          </Button>
        </div>
      </Card>

      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <KPICard label="総利用回数" value={`${mockKPI.totalUsageCount.toLocaleString()}件`} growth={mockKPI.countGrowth} iconName="chart" />
        <KPICard label="総売上金額" value={formatCurrency(mockKPI.totalRevenue)} growth={mockKPI.revenueGrowth} iconName="credit-card" />
        <KPICard label="平均稼働率" value={`${mockKPI.averageOccupancy}%`} iconName="room" />
        <KPICard label="アクティブユーザー" value={`${mockKPI.activeUsers}人`} iconName="users" />
      </div>

      {/* Period trend chart */}
      {dimension === 'period' && (
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Icon name="chart" size={18} />
            <span style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--foreground)' }}>
              期間別推移（利用回数 / 売上金額）
            </span>
            <Badge variant="info" className="ml-auto">過去6ヶ月</Badge>
          </div>
          <TrendChart data={mockTrend} />
        </Card>
      )}

      {/* Room occupancy chart */}
      {dimension === 'room' && (
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Icon name="room" size={18} />
            <span style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--foreground)' }}>
              物件別稼働率
            </span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground-muted)', marginLeft: 'auto' }}>
              破線: 目標稼働率 50%
            </span>
          </div>
          <OccupancyChart data={mockRoomOccupancy} />
        </Card>
      )}

      {/* Detail table */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Icon name="chart" size={18} />
          <span style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--foreground)' }}>
            物件別明細
          </span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)' }}>
                {['会議室名', '利用回数', '売上金額', '稼働率'].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: '10px 12px',
                      textAlign: 'left',
                      color: 'var(--foreground-secondary)',
                      fontWeight: 'var(--font-medium)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockRoomDetails.map((r) => {
                const occColor = r.occupancyRate >= 80 ? '#16A34A' : r.occupancyRate >= 50 ? '#2563EB' : '#F59E0B'
                return (
                  <tr key={r.roomName} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '10px 12px', color: 'var(--foreground)' }}>{r.roomName}</td>
                    <td style={{ padding: '10px 12px', color: 'var(--foreground)' }}>{r.count}件</td>
                    <td style={{ padding: '10px 12px', color: 'var(--foreground)', textAlign: 'right' }}>{formatCurrency(r.revenue)}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: occColor }}>
                        {r.occupancyRate.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Story meta                                                            */
/* ------------------------------------------------------------------ */

const meta: Meta = {
  title: 'Pages/管理者/利用状況分析',
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
        <AdminLayout pageTitle="利用状況分析" activeNav="利用分析">
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

export const PeriodView: Story = {
  name: '期間別（デフォルト）',
  render: () => <UsageAnalyticsPage initialDimension="period" />,
}

export const RoomView: Story = {
  name: '物件別（稼働率グラフ）',
  render: () => <UsageAnalyticsPage initialDimension="room" />,
}

export const MemberView: Story = {
  name: '会員別',
  render: () => <UsageAnalyticsPage initialDimension="member" />,
}
