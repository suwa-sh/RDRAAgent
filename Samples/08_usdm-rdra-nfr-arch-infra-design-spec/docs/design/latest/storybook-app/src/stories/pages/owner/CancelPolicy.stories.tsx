import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React, { useState } from 'react'
import { OwnerLayout } from '@/components/layout/OwnerLayout'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { PriceDisplay } from '@/components/domain/PriceDisplay'
import { Icon } from '@/components/ui/Icon'

// ---- モックデータ ----

const defaultPolicies = [
  { id: 1, daysBeforeLabel: '当日キャンセル', daysBefore: 0, rate: 100 },
  { id: 2, daysBeforeLabel: '前日キャンセル', daysBefore: 1, rate: 50 },
  { id: 3, daysBeforeLabel: '3日前キャンセル', daysBefore: 3, rate: 30 },
  { id: 4, daysBeforeLabel: '7日前以前', daysBefore: 7, rate: 0 },
]

// ---- ページコンポーネント ----

interface CancelPolicyPageProps {
  saved?: boolean
}

const CancelPolicyPage: React.FC<CancelPolicyPageProps> = ({ saved = false }) => {
  const [policies, setPolicies] = useState(defaultPolicies)
  const samplePrice = 5000

  const updateRate = (id: number, value: string) => {
    setPolicies((prev) =>
      prev.map((p) => (p.id === id ? { ...p, rate: Number(value) } : p))
    )
  }

  return (
    <OwnerLayout
      breadcrumbs={[
        { label: 'ダッシュボード', href: '/owner' },
        { label: 'キャンセルポリシー設定' },
      ]}
    >
      <div style={{ maxWidth: 680, display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
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
            キャンセルポリシー設定
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)', marginTop: 'var(--space-1)' }}>
            キャンセル時の返金ルールを設定します。料率 0% は全額返金を意味します。
          </p>
        </div>

        {saved && (
          <div
            style={{
              background: 'var(--success-light)',
              border: '1px solid var(--success)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-3) var(--space-4)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              color: 'var(--color-green-700)',
              fontSize: 'var(--text-sm)',
            }}
          >
            <Icon name="shield-check" size={16} />
            キャンセルポリシーを保存しました
          </div>
        )}

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
              キャンセル料率設定
            </h2>

            {/* ヘッダー行 */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 120px 160px',
                gap: 'var(--space-3)',
                padding: '0 var(--space-2)',
              }}
            >
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)', color: 'var(--foreground-secondary)' }}>
                キャンセル期限
              </span>
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)', color: 'var(--foreground-secondary)' }}>
                料率 (%)
              </span>
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)', color: 'var(--foreground-secondary)' }}>
                請求例 (¥5,000/時)
              </span>
            </div>

            <div
              style={{
                borderTop: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
              }}
            >
              {policies.map((policy) => {
                const chargeAmount = Math.round((samplePrice * policy.rate) / 100)
                return (
                  <div
                    key={policy.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 120px 160px',
                      gap: 'var(--space-3)',
                      alignItems: 'center',
                      padding: 'var(--space-3) var(--space-2)',
                      borderBottom: '1px solid var(--border)',
                    }}
                  >
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>
                      {policy.daysBeforeLabel}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                      <input
                        type="number"
                        value={policy.rate}
                        min={0}
                        max={100}
                        onChange={(e) => updateRate(policy.id, e.target.value)}
                        style={{
                          width: 72,
                          height: 'var(--input-height)',
                          padding: '0 var(--input-px)',
                          borderRadius: 'var(--input-radius)',
                          border: '1px solid var(--input-border)',
                          fontSize: 'var(--input-font-size)',
                          background: 'var(--background)',
                          color: 'var(--foreground)',
                          outline: 'none',
                        }}
                      />
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)' }}>%</span>
                    </div>
                    <div>
                      {chargeAmount === 0 ? (
                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-green-700)', fontWeight: 'var(--font-medium)' }}>
                          全額返金
                        </span>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                          <PriceDisplay amount={chargeAmount} unit="hour" size="sm" />
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground-muted)' }}>請求</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </Card>

        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
          <Button variant="outline" size="md">キャンセル</Button>
          <Button variant="default" size="md">
            <Icon name="shield-check" size={16} />
            保存する
          </Button>
        </div>
      </div>
    </OwnerLayout>
  )
}

// ---- Meta ----

const meta: Meta<typeof CancelPolicyPage> = {
  title: 'Pages/オーナー/キャンセルポリシー設定',
  component: CancelPolicyPage,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof CancelPolicyPage>

export const Default: Story = { args: { saved: false } }
export const Saved: Story = { args: { saved: true } }
