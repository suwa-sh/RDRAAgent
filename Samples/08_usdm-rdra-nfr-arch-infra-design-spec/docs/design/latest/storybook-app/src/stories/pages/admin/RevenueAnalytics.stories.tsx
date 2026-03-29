import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React from 'react'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'

const meta: Meta = {
  title: 'Pages/管理者/手数料売上分析',
  parameters: {
    layout: 'fullscreen',
    globals: { portal: 'admin' },
  },
}

export default meta
type Story = StoryObj

/* ----------------------------------------------------------------
   Mock data
---------------------------------------------------------------- */

const monthlyData = [
  { month: '2025年10月', amount: 312000, count: 124 },
  { month: '2025年11月', amount: 278000, count: 108 },
  { month: '2025年12月', amount: 398000, count: 156 },
  { month: '2026年1月',  amount: 421000, count: 167 },
  { month: '2026年2月',  amount: 356000, count: 141 },
  { month: '2026年3月',  amount: 487000, count: 192 },
]

const roomRanking = [
  { name: '渋谷A会議室',   amount: 89000,  pct: 18 },
  { name: '新宿プレミアム', amount: 76000,  pct: 16 },
  { name: '品川ラウンジ',   amount: 68000,  pct: 14 },
  { name: '池袋スタジオ',   amount: 54000,  pct: 11 },
  { name: '銀座セミナー室', amount: 47000,  pct: 10 },
]

const maxAmount = Math.max(...monthlyData.map((d) => d.amount))

/* ----------------------------------------------------------------
   Sub components
---------------------------------------------------------------- */

const KpiCard: React.FC<{
  label: string
  value: string
  sub: string
  subColor?: string
  icon: 'chart' | 'users' | 'credit-card' | 'calendar'
}> = ({ label, value, sub, subColor = 'var(--foreground-muted)', icon }) => (
  <Card>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)' }}>{label}</span>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 'var(--radius-lg)',
          background: 'var(--color-gray-100)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon name={icon} size={18} />
      </div>
    </div>
    <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--foreground)', marginBottom: 'var(--space-1)' }}>
      {value}
    </div>
    <div style={{ fontSize: 'var(--text-xs)', color: subColor }}>{sub}</div>
  </Card>
)

const BarChartMock: React.FC = () => (
  <div>
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-2)', height: 160, paddingBottom: 'var(--space-2)' }}>
      {monthlyData.map((d) => {
        const barHeight = Math.round((d.amount / maxAmount) * 140)
        return (
          <div
            key={d.month}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-1)' }}
          >
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground-muted)' }}>
              ¥{Math.round(d.amount / 1000)}k
            </span>
            <div
              style={{
                width: '100%',
                height: barHeight,
                background: '#334155',
                borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
                transition: 'opacity var(--duration-normal)',
              }}
            />
          </div>
        )
      })}
    </div>
    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
      {monthlyData.map((d) => (
        <div key={d.month} style={{ flex: 1, textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--foreground-muted)' }}>
          {d.month.slice(5)}
        </div>
      ))}
    </div>
  </div>
)

/* ----------------------------------------------------------------
   Page Story
---------------------------------------------------------------- */

const RevenueAnalyticsPage: React.FC = () => (
  <AdminLayout pageTitle="手数料売上分析" activeNav="利用分析">
    {/* Filter bar */}
    <Card className="mb-[var(--space-6)]">
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          <label style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground-secondary)', fontWeight: 'var(--font-medium)' }}>
            売上分析区分
          </label>
          <select
            style={{
              height: 'var(--input-height)',
              paddingLeft: 'var(--input-px)',
              paddingRight: 'var(--space-8)',
              borderRadius: 'var(--input-radius)',
              border: '1px solid var(--input-border)',
              fontSize: 'var(--input-font-size)',
              background: 'var(--background)',
              color: 'var(--foreground)',
              cursor: 'pointer',
            }}
            defaultValue="monthly"
          >
            <option value="monthly">月別</option>
            <option value="room">会議室別</option>
            <option value="owner">オーナー別</option>
            <option value="rental">貸出別</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          <label style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground-secondary)', fontWeight: 'var(--font-medium)' }}>
            集計期間（開始）
          </label>
          <input
            type="date"
            defaultValue="2025-10-01"
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
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          <label style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground-secondary)', fontWeight: 'var(--font-medium)' }}>
            集計期間（終了）
          </label>
          <input
            type="date"
            defaultValue="2026-03-31"
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
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          <label style={{ fontSize: 'var(--text-xs)', color: 'transparent' }}>実行</label>
          <Button variant="default" style={{ background: '#334155' }}>
            <Icon name="chart" size={14} />
            分析実行
          </Button>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'flex-end' }}>
          <Button variant="outline" size="sm">
            CSVダウンロード
          </Button>
        </div>
      </div>
    </Card>

    {/* KPI cards */}
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 'var(--space-4)',
        marginBottom: 'var(--space-6)',
      }}
    >
      <KpiCard
        label="今月売上（手数料）"
        value="¥487,000"
        sub="+13.8% 前月比"
        subColor="var(--color-green-600)"
        icon="credit-card"
      />
      <KpiCard
        label="前月比"
        value="+¥131,000"
        sub="2026年2月: ¥356,000"
        icon="chart"
      />
      <KpiCard
        label="アクティブオーナー数"
        value="38名"
        sub="先月比 +2名"
        subColor="var(--color-green-600)"
        icon="users"
      />
      <KpiCard
        label="取引件数"
        value="192件"
        sub="1件あたり ¥2,536"
        icon="calendar"
      />
    </div>

    {/* Charts row */}
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: 'var(--space-4)',
        marginBottom: 'var(--space-6)',
      }}
    >
      {/* Bar chart */}
      <Card>
        <h2
          style={{
            fontSize: 'var(--text-base)',
            fontWeight: 'var(--font-semibold)',
            color: 'var(--foreground)',
            marginBottom: 'var(--space-4)',
          }}
        >
          月別売上推移
        </h2>
        <BarChartMock />
        <div
          style={{
            marginTop: 'var(--space-4)',
            padding: 'var(--space-3)',
            background: 'var(--background-secondary)',
            borderRadius: 'var(--radius-lg)',
            fontSize: 'var(--text-xs)',
            color: 'var(--foreground-muted)',
          }}
        >
          集計期間: 2025年10月 〜 2026年3月 / 合計: ¥2,252,000
        </div>
      </Card>

      {/* Room ranking */}
      <Card>
        <h2
          style={{
            fontSize: 'var(--text-base)',
            fontWeight: 'var(--font-semibold)',
            color: 'var(--foreground)',
            marginBottom: 'var(--space-4)',
          }}
        >
          会議室別売上ランキング
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {roomRanking.map((room, idx) => (
            <div key={room.name}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 'var(--space-1)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <span
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 'var(--radius-full)',
                      background: idx === 0 ? '#F59E0B' : idx === 1 ? 'var(--color-gray-400)' : idx === 2 ? '#EA580C' : 'var(--color-gray-200)',
                      color: idx < 3 ? '#FFFFFF' : 'var(--foreground-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-bold)',
                    }}
                  >
                    {idx + 1}
                  </span>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>{room.name}</span>
                </div>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--foreground)' }}>
                  ¥{room.amount.toLocaleString()}
                </span>
              </div>
              <div
                style={{
                  height: 6,
                  background: 'var(--color-gray-100)',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${room.pct * 5}%`,
                    background: '#334155',
                    borderRadius: 'var(--radius-full)',
                  }}
                />
              </div>
              <div style={{ textAlign: 'right', fontSize: 'var(--text-xs)', color: 'var(--foreground-muted)', marginTop: 'var(--space-0-5)' }}>
                {room.pct}%
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>

    {/* Detail table */}
    <Card>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-4)',
        }}
      >
        <h2
          style={{
            fontSize: 'var(--text-base)',
            fontWeight: 'var(--font-semibold)',
            color: 'var(--foreground)',
          }}
        >
          月別明細
        </h2>
        <Badge variant="info">6件</Badge>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--table-header-bg)' }}>
              {['年月', '手数料合計', '件数', '前期比'].map((col) => (
                <th
                  key={col}
                  style={{
                    padding: 'var(--table-cell-padding)',
                    textAlign: 'left',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'var(--table-header-weight)',
                    color: 'var(--foreground-secondary)',
                    borderBottom: '1px solid var(--table-border)',
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {monthlyData.map((row, i) => {
              const prev = monthlyData[i - 1]
              const diff = prev ? row.amount - prev.amount : null
              const diffPct = prev ? Math.round((diff! / prev.amount) * 100) : null
              const isUp = diff !== null && diff > 0
              return (
                <tr
                  key={row.month}
                  style={{
                    borderBottom: '1px solid var(--table-border)',
                    height: 'var(--table-row-height)',
                  }}
                >
                  <td style={{ padding: 'var(--table-cell-padding)', fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>
                    {row.month}
                  </td>
                  <td style={{ padding: 'var(--table-cell-padding)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--foreground)' }}>
                    ¥{row.amount.toLocaleString()}
                  </td>
                  <td style={{ padding: 'var(--table-cell-padding)', fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>
                    {row.count}件
                  </td>
                  <td style={{ padding: 'var(--table-cell-padding)', fontSize: 'var(--text-sm)' }}>
                    {diffPct !== null ? (
                      <span style={{ color: isUp ? 'var(--color-green-600)' : 'var(--color-red-600)', fontWeight: 'var(--font-medium)' }}>
                        {isUp ? '+' : ''}{diffPct}%
                      </span>
                    ) : (
                      <span style={{ color: 'var(--foreground-muted)' }}>—</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  </AdminLayout>
)

export const Default: Story = {
  render: () => <RevenueAnalyticsPage />,
}
