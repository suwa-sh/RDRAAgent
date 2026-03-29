import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React, { useState } from 'react'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { OwnerVerificationBadge, type OwnerStatus } from '@/components/domain/OwnerVerificationBadge'

const meta: Meta = {
  title: 'Pages/管理者/オーナー審査一覧',
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

type ReviewStatus = 'under-review' | 'verified' | 'rejected' | 'withdrawn'

interface OwnerRecord {
  id: string
  name: string
  email: string
  appliedAt: string
  status: OwnerStatus
  elapsedDays: number
}

const owners: OwnerRecord[] = [
  { id: 'OWN-001', name: '田中太郎',   email: 'tanaka@example.com',    appliedAt: '2026-03-22', status: 'under-review', elapsedDays: 7  },
  { id: 'OWN-002', name: '佐藤花子',   email: 'sato@example.com',      appliedAt: '2026-03-24', status: 'under-review', elapsedDays: 5  },
  { id: 'OWN-003', name: '鈴木一郎',   email: 'suzuki@example.com',    appliedAt: '2026-03-26', status: 'under-review', elapsedDays: 3  },
  { id: 'OWN-004', name: '高橋美咲',   email: 'takahashi@example.com', appliedAt: '2026-03-27', status: 'under-review', elapsedDays: 2  },
  { id: 'OWN-005', name: '渡辺健二',   email: 'watanabe@example.com',  appliedAt: '2026-03-28', status: 'under-review', elapsedDays: 1  },
  { id: 'OWN-006', name: '中村洋子',   email: 'nakamura@example.com',  appliedAt: '2026-03-10', status: 'verified',     elapsedDays: 19 },
  { id: 'OWN-007', name: '山本拓也',   email: 'yamamoto@example.com',  appliedAt: '2026-03-05', status: 'rejected',     elapsedDays: 24 },
  { id: 'OWN-008', name: '小林雅彦',   email: 'kobayashi@example.com', appliedAt: '2026-02-15', status: 'withdrawn',    elapsedDays: 42 },
]

type TabKey = 'all' | 'under-review' | 'verified' | 'rejected' | 'withdrawn'

const tabs: { key: TabKey; label: string }[] = [
  { key: 'all',          label: '全件' },
  { key: 'under-review', label: '審査待ち' },
  { key: 'verified',     label: '登録済み' },
  { key: 'rejected',     label: '却下' },
  { key: 'withdrawn',    label: '退会' },
]

/* ----------------------------------------------------------------
   Page component
---------------------------------------------------------------- */

const OwnerReviewListPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('under-review')
  const [keyword, setKeyword] = useState('')
  const [sortAsc, setSortAsc] = useState(false)

  const pendingCount = owners.filter((o) => o.status === 'under-review').length

  const filtered = owners
    .filter((o) => activeTab === 'all' || o.status === activeTab)
    .filter(
      (o) =>
        keyword === '' ||
        o.name.includes(keyword) ||
        o.email.includes(keyword)
    )
    .sort((a, b) =>
      sortAsc
        ? a.appliedAt.localeCompare(b.appliedAt)
        : b.appliedAt.localeCompare(a.appliedAt)
    )

  return (
    <AdminLayout pageTitle="オーナー審査一覧" activeNav="オーナー管理">
      {/* Tabs + search */}
      <Card className="mb-[var(--space-4)]">
        {/* Tab bar */}
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-1)',
            borderBottom: '1px solid var(--border)',
            marginBottom: 'var(--space-4)',
            paddingBottom: 'var(--space-1)',
          }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  padding: 'var(--space-2) var(--space-3)',
                  borderRadius: 'var(--radius-lg)',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 'var(--text-sm)',
                  fontWeight: isActive ? 'var(--font-semibold)' : 'var(--font-normal)',
                  color: isActive ? '#334155' : 'var(--foreground-secondary)',
                  background: isActive ? 'var(--color-gray-100)' : 'transparent',
                  transition: 'background var(--duration-normal)',
                }}
              >
                {tab.label}
                {tab.key === 'under-review' && pendingCount > 0 && (
                  <span
                    style={{
                      minWidth: 20,
                      height: 20,
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--color-red-500)',
                      color: '#FFFFFF',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-bold)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingLeft: 'var(--space-1)',
                      paddingRight: 'var(--space-1)',
                    }}
                  >
                    {pendingCount}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
            <span
              style={{
                position: 'absolute',
                left: 'var(--space-3)',
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Icon name="search" size={16} />
            </span>
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="オーナー名・メールアドレスで検索"
              style={{
                width: '100%',
                height: 'var(--input-height)',
                paddingLeft: 'var(--space-9)',
                paddingRight: 'var(--input-px)',
                borderRadius: 'var(--input-radius)',
                border: '1px solid var(--input-border)',
                fontSize: 'var(--input-font-size)',
                background: 'var(--background)',
                color: 'var(--foreground)',
              }}
            />
          </div>
          <Badge variant="default">{filtered.length}件</Badge>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--table-header-bg)' }}>
                <th
                  style={{
                    padding: 'var(--table-cell-padding)',
                    textAlign: 'left',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'var(--table-header-weight)',
                    color: 'var(--foreground-secondary)',
                    borderBottom: '1px solid var(--table-border)',
                  }}
                >
                  オーナー名
                </th>
                <th
                  style={{
                    padding: 'var(--table-cell-padding)',
                    textAlign: 'left',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'var(--table-header-weight)',
                    color: 'var(--foreground-secondary)',
                    borderBottom: '1px solid var(--table-border)',
                  }}
                >
                  メールアドレス
                </th>
                <th
                  onClick={() => setSortAsc((v) => !v)}
                  style={{
                    padding: 'var(--table-cell-padding)',
                    textAlign: 'left',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'var(--table-header-weight)',
                    color: 'var(--foreground-secondary)',
                    borderBottom: '1px solid var(--table-border)',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                    申請日
                    <span style={{ color: 'var(--foreground-muted)', fontSize: 10 }}>
                      {sortAsc ? '▲' : '▼'}
                    </span>
                  </span>
                </th>
                <th
                  style={{
                    padding: 'var(--table-cell-padding)',
                    textAlign: 'left',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'var(--table-header-weight)',
                    color: 'var(--foreground-secondary)',
                    borderBottom: '1px solid var(--table-border)',
                  }}
                >
                  経過日数
                </th>
                <th
                  style={{
                    padding: 'var(--table-cell-padding)',
                    textAlign: 'left',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'var(--table-header-weight)',
                    color: 'var(--foreground-secondary)',
                    borderBottom: '1px solid var(--table-border)',
                  }}
                >
                  審査状態
                </th>
                <th
                  style={{
                    padding: 'var(--table-cell-padding)',
                    textAlign: 'right',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'var(--table-header-weight)',
                    color: 'var(--foreground-secondary)',
                    borderBottom: '1px solid var(--table-border)',
                  }}
                >
                  操作
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      padding: 'var(--space-12)',
                      textAlign: 'center',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--foreground-muted)',
                    }}
                  >
                    該当するオーナーが見つかりません
                  </td>
                </tr>
              ) : (
                filtered.map((owner) => {
                  const isWarning = owner.status === 'under-review' && owner.elapsedDays >= 7
                  return (
                    <tr
                      key={owner.id}
                      style={{
                        borderBottom: '1px solid var(--table-border)',
                        height: 'var(--table-row-height)',
                        transition: 'background var(--duration-fast)',
                      }}
                    >
                      <td style={{ padding: 'var(--table-cell-padding)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--foreground)' }}>
                        {owner.name}
                      </td>
                      <td style={{ padding: 'var(--table-cell-padding)', fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)' }}>
                        {owner.email}
                      </td>
                      <td style={{ padding: 'var(--table-cell-padding)', fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>
                        {owner.appliedAt}
                      </td>
                      <td style={{ padding: 'var(--table-cell-padding)', fontSize: 'var(--text-sm)' }}>
                        <span
                          style={{
                            color: isWarning ? 'var(--color-red-600)' : 'var(--foreground-muted)',
                            fontWeight: isWarning ? 'var(--font-semibold)' : 'var(--font-normal)',
                          }}
                        >
                          {owner.elapsedDays}日
                        </span>
                      </td>
                      <td style={{ padding: 'var(--table-cell-padding)' }}>
                        <OwnerVerificationBadge status={owner.status} />
                      </td>
                      <td style={{ padding: 'var(--table-cell-padding)', textAlign: 'right' }}>
                        <Button variant="secondary" size="sm">
                          詳細
                        </Button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination mock */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 'var(--space-4)',
            paddingTop: 'var(--space-4)',
            borderTop: '1px solid var(--border)',
          }}
        >
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-muted)' }}>
            {filtered.length}件中 1-{Math.min(filtered.length, 10)}件表示
          </span>
          <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
            <Button variant="outline" size="sm" disabled>前へ</Button>
            <Button variant="outline" size="sm" style={{ background: '#334155', color: '#FFFFFF', borderColor: '#334155' }}>1</Button>
            <Button variant="outline" size="sm">次へ</Button>
          </div>
        </div>
      </Card>
    </AdminLayout>
  )
}

export const Default: Story = {
  render: () => <OwnerReviewListPage />,
}

export const WithWarning: Story = {
  name: '審査待ち（警告あり）',
  render: () => <OwnerReviewListPage />,
  parameters: {
    docs: {
      description: {
        story: '経過7日以上の審査待ちオーナーは経過日数が赤色で強調表示されます。',
      },
    },
  },
}
