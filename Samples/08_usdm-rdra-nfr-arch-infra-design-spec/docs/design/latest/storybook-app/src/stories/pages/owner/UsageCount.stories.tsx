import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React from 'react'
import { OwnerLayout } from '@/components/layout/OwnerLayout'
import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'

// ---- モックデータ ----

const monthlyData = [
  { month: '10月', count: 45 },
  { month: '11月', count: 52 },
  { month: '12月', count: 38 },
  { month: '1月', count: 61 },
  { month: '2月', count: 58 },
  { month: '3月', count: 74 },
]

const roomData = [
  { id: 'room-001', name: '大会議室A（渋谷）', count: 142, percentage: 49, trend: 'up' as const },
  { id: 'room-002', name: '小会議室B（新宿）', count: 98, percentage: 34, trend: 'up' as const },
  { id: 'vroom-001', name: 'バーチャル会議室 Premium', count: 35, percentage: 12, trend: 'down' as const },
  { id: 'room-003', name: 'セミナールーム（品川）', count: 14, percentage: 5, trend: 'up' as const },
]

const kpiData = [
  {
    label: '今月の利用回数',
    value: '74',
    unit: '回',
    change: '+16%',
    positive: true,
    icon: 'calendar' as const,
  },
  {
    label: '先月の利用回数',
    value: '58',
    unit: '回',
    change: '-5%',
    positive: false,
    icon: 'chart' as const,
  },
  {
    label: '累計利用回数',
    value: '289',
    unit: '回',
    change: '',
    positive: true,
    icon: 'users' as const,
  },
  {
    label: '稼働率（今月）',
    value: '68',
    unit: '%',
    change: '+8pt',
    positive: true,
    icon: 'shield-check' as const,
  },
]

const maxCount = Math.max(...monthlyData.map((d) => d.count))

// ---- ページコンポーネント ----

const UsageCountPage: React.FC = () => {
  return (
    <OwnerLayout
      breadcrumbs={[
        { label: 'ダッシュボード', href: '/owner' },
        { label: '利用回数確認' },
      ]}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {/* ページタイトル */}
        <div>
          <h1
            style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--font-bold)',
              color: 'var(--foreground)',
              margin: 0,
            }}
          >
            利用回数確認
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)', marginTop: 'var(--space-1)' }}>
            会議室ごとの利用回数・稼働状況を確認します
          </p>
        </div>

        {/* KPI カード */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
          {kpiData.map((kpi) => (
            <Card key={kpi.label}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 'var(--radius-lg)',
                      background: 'var(--primary-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon name={kpi.icon} size={16} />
                  </div>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)' }}>
                    {kpi.label}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
                  <span style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)', color: 'var(--foreground)' }}>
                    {kpi.value}
                  </span>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)' }}>
                    {kpi.unit}
                  </span>
                  {kpi.change && (
                    <span
                      style={{
                        fontSize: 'var(--text-xs)',
                        fontWeight: 'var(--font-semibold)',
                        color: kpi.positive ? 'var(--color-green-700)' : 'var(--color-red-700)',
                        marginLeft: 'auto',
                      }}
                    >
                      {kpi.change}
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* 月別棒グラフ */}
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <h2
              style={{
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-semibold)',
                color: 'var(--foreground)',
                margin: 0,
              }}
            >
              月別利用回数推移（過去6ヶ月）
            </h2>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-3)', height: 160, paddingBottom: 24 }}>
              {monthlyData.map((d) => {
                const barHeight = Math.round((d.count / maxCount) * 130)
                return (
                  <div
                    key={d.month}
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 'var(--space-1)',
                      position: 'relative',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 'var(--text-xs)',
                        fontWeight: 'var(--font-medium)',
                        color: d.month === '3月' ? 'var(--primary)' : 'var(--foreground-secondary)',
                        position: 'absolute',
                        top: -(20),
                      }}
                    >
                      {d.count}
                    </span>
                    <div
                      style={{
                        width: '100%',
                        height: barHeight,
                        background: d.month === '3月' ? 'var(--primary)' : 'var(--primary-light)',
                        borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
                        transition: 'height 0.3s ease',
                        position: 'absolute',
                        bottom: 24,
                        border: d.month === '3月' ? '1px solid var(--primary)' : '1px solid var(--border)',
                      }}
                    />
                    <span
                      style={{
                        fontSize: 'var(--text-xs)',
                        color: d.month === '3月' ? 'var(--primary)' : 'var(--foreground-muted)',
                        position: 'absolute',
                        bottom: 0,
                        fontWeight: d.month === '3月' ? 'var(--font-semibold)' : 'var(--font-normal)',
                      }}
                    >
                      {d.month}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </Card>

        {/* 会議室別テーブル */}
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <h2
              style={{
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-semibold)',
                color: 'var(--foreground)',
                margin: 0,
              }}
            >
              会議室別利用回数
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)' }}>
                    <th style={{ textAlign: 'left', padding: 'var(--space-2) var(--space-3)', color: 'var(--foreground-secondary)', fontWeight: 'var(--font-medium)' }}>
                      会議室名
                    </th>
                    <th style={{ textAlign: 'right', padding: 'var(--space-2) var(--space-3)', color: 'var(--foreground-secondary)', fontWeight: 'var(--font-medium)' }}>
                      累計回数
                    </th>
                    <th style={{ textAlign: 'left', padding: 'var(--space-2) var(--space-3)', color: 'var(--foreground-secondary)', fontWeight: 'var(--font-medium)', minWidth: 160 }}>
                      割合
                    </th>
                    <th style={{ textAlign: 'center', padding: 'var(--space-2) var(--space-3)', color: 'var(--foreground-secondary)', fontWeight: 'var(--font-medium)' }}>
                      前月比
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {roomData.map((room) => (
                    <tr key={room.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: 'var(--space-3)', color: 'var(--foreground)' }}>
                        {room.name}
                      </td>
                      <td style={{ padding: 'var(--space-3)', textAlign: 'right', fontWeight: 'var(--font-semibold)', color: 'var(--foreground)' }}>
                        {room.count}回
                      </td>
                      <td style={{ padding: 'var(--space-3)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                          <div
                            style={{
                              flex: 1,
                              height: 8,
                              background: 'var(--muted)',
                              borderRadius: 'var(--radius-full)',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                height: '100%',
                                width: `${room.percentage}%`,
                                background: 'var(--primary)',
                                borderRadius: 'var(--radius-full)',
                              }}
                            />
                          </div>
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground-secondary)', minWidth: 32 }}>
                            {room.percentage}%
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: 'var(--space-3)', textAlign: 'center' }}>
                        <span
                          style={{
                            fontSize: 'var(--text-xs)',
                            fontWeight: 'var(--font-medium)',
                            color: room.trend === 'up' ? 'var(--color-green-700)' : 'var(--color-red-700)',
                          }}
                        >
                          {room.trend === 'up' ? '▲ 上昇' : '▼ 下降'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>
    </OwnerLayout>
  )
}

// ---- Meta ----

const meta: Meta<typeof UsageCountPage> = {
  title: 'Pages/オーナー/利用回数確認',
  component: UsageCountPage,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof UsageCountPage>

export const Default: Story = {}
