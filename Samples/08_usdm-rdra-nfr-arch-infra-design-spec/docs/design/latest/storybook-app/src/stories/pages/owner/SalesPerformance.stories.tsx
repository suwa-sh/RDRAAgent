import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React, { useState } from 'react'
import { OwnerLayout } from '@/components/layout/OwnerLayout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { PriceDisplay } from '@/components/domain/PriceDisplay'
import { Icon } from '@/components/ui/Icon'

// ---- モックデータ ----

const monthlyRevenue = [
  { month: '10月', amount: 225000 },
  { month: '11月', amount: 260000 },
  { month: '12月', amount: 190000 },
  { month: '1月', amount: 305000 },
  { month: '2月', amount: 290000 },
  { month: '3月', amount: 370000 },
]

const kpiData = [
  {
    label: '今月の売上',
    value: 370000,
    change: '+27.6%',
    positive: true,
    icon: 'chart' as const,
  },
  {
    label: '先月の売上',
    value: 290000,
    change: '-5.2%',
    positive: false,
    icon: 'credit-card' as const,
  },
  {
    label: '累計売上（今年度）',
    value: 1640000,
    change: '',
    positive: true,
    icon: 'shield-check' as const,
  },
  {
    label: '平均単価',
    value: 5000,
    change: '+¥200',
    positive: true,
    icon: 'calendar' as const,
  },
]

const roomRevenue = [
  { name: '大会議室A（渋谷）', amount: 710000, percentage: 43 },
  { name: '小会議室B（新宿）', amount: 490000, percentage: 30 },
  { name: 'セミナールーム（品川）', amount: 372800, percentage: 23 },
  { name: 'バーチャル会議室 Premium', amount: 67200, percentage: 4 },
]

const maxAmount = Math.max(...monthlyRevenue.map((d) => d.amount))

// ---- ページコンポーネント ----

interface SalesPerformancePageProps {
  period?: '6m' | '12m'
}

const SalesPerformancePage: React.FC<SalesPerformancePageProps> = ({ period = '6m' }) => {
  const [activePeriod, setActivePeriod] = useState<'6m' | '12m'>(period)

  return (
    <OwnerLayout
      breadcrumbs={[
        { label: 'ダッシュボード', href: '/owner' },
        { label: '売上実績確認' },
      ]}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {/* ページタイトル */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <div>
            <h1
              style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: 'var(--font-bold)',
                color: 'var(--foreground)',
                margin: 0,
              }}
            >
              売上実績確認
            </h1>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)', marginTop: 'var(--space-1)' }}>
              会議室の売上・収益状況を確認します
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Icon name="chart" size={14} />
            CSVエクスポート
          </Button>
        </div>

        {/* KPI カード */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
          {kpiData.map((kpi) => (
            <Card key={kpi.label}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
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
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                  <PriceDisplay amount={kpi.value} unit="day" size="lg" />
                  {kpi.change && (
                    <span
                      style={{
                        fontSize: 'var(--text-xs)',
                        fontWeight: 'var(--font-semibold)',
                        color: kpi.positive ? 'var(--color-green-700)' : 'var(--color-red-700)',
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

        {/* 月別推移グラフ */}
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
              <h2
                style={{
                  fontSize: 'var(--text-base)',
                  fontWeight: 'var(--font-semibold)',
                  color: 'var(--foreground)',
                  margin: 0,
                }}
              >
                月別売上推移
              </h2>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                {(['6m', '12m'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setActivePeriod(p)}
                    style={{
                      padding: 'var(--space-1) var(--space-3)',
                      borderRadius: 'var(--radius-lg)',
                      border: `1px solid ${activePeriod === p ? 'var(--primary)' : 'var(--border)'}`,
                      background: activePeriod === p ? 'var(--primary-light)' : 'var(--background)',
                      color: activePeriod === p ? 'var(--primary)' : 'var(--foreground-secondary)',
                      fontSize: 'var(--text-xs)',
                      cursor: 'pointer',
                      transition: 'all var(--duration-fast)',
                    }}
                  >
                    {p === '6m' ? '直近6ヶ月' : '直近12ヶ月'}
                  </button>
                ))}
              </div>
            </div>

            {/* 棒グラフ */}
            <div style={{ position: 'relative', height: 200, paddingBottom: 28, paddingTop: 24 }}>
              {/* Y軸目盛り */}
              {[0, 100000, 200000, 300000, 400000].map((val) => (
                <div
                  key={val}
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 28 + (val / maxAmount) * 130,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                  }}
                >
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground-muted)', minWidth: 52, textAlign: 'right' }}>
                    {val === 0 ? '¥0' : `¥${(val / 10000).toFixed(0)}万`}
                  </span>
                  <div style={{ flex: 1, height: 1, background: 'var(--border)', opacity: 0.5 }} />
                </div>
              ))}
              {/* バー */}
              <div
                style={{
                  position: 'absolute',
                  left: 60,
                  right: 0,
                  bottom: 28,
                  top: 0,
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: 'var(--space-2)',
                }}
              >
                {monthlyRevenue.map((d) => {
                  const barHeight = Math.round((d.amount / maxAmount) * 130)
                  return (
                    <div
                      key={d.month}
                      style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 0,
                        height: '100%',
                        justifyContent: 'flex-end',
                      }}
                    >
                      <span
                        style={{
                          fontSize: 'var(--text-xs)',
                          color: d.month === '3月' ? 'var(--primary)' : 'var(--foreground-muted)',
                          marginBottom: 2,
                          fontWeight: d.month === '3月' ? 'var(--font-semibold)' : 'var(--font-normal)',
                        }}
                      >
                        ¥{(d.amount / 10000).toFixed(0)}万
                      </span>
                      <div
                        style={{
                          width: '100%',
                          height: barHeight,
                          background: d.month === '3月' ? 'var(--primary)' : 'var(--primary-light)',
                          borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
                          border: d.month === '3月' ? '1px solid var(--primary)' : '1px solid var(--border)',
                        }}
                      />
                      <span
                        style={{
                          fontSize: 'var(--text-xs)',
                          color: d.month === '3月' ? 'var(--primary)' : 'var(--foreground-muted)',
                          marginTop: 4,
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
          </div>
        </Card>

        {/* 会議室別売上 */}
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
              会議室別売上（今年度累計）
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {roomRevenue.map((room) => (
                <div key={room.name} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>{room.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground-secondary)' }}>
                        {room.percentage}%
                      </span>
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--foreground)' }}>
                        ¥{room.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div style={{ height: 8, background: 'var(--muted)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${room.percentage}%`,
                        background: 'var(--primary)',
                        borderRadius: 'var(--radius-full)',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </OwnerLayout>
  )
}

// ---- Meta ----

const meta: Meta<typeof SalesPerformancePage> = {
  title: 'Pages/オーナー/売上実績確認',
  component: SalesPerformancePage,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof SalesPerformancePage>

export const Default: Story = { args: { period: '6m' } }
export const TwelveMonths: Story = { args: { period: '12m' } }
