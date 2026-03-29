import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React, { useState } from 'react'
import { OwnerLayout } from '@/components/layout/OwnerLayout'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'

// ---- ページコンポーネント ----

interface OperationRulesPageProps {
  saved?: boolean
}

const OperationRulesPage: React.FC<OperationRulesPageProps> = ({ saved = false }) => {
  const [available, setAvailable] = useState(true)
  const [form, setForm] = useState({
    openTime: '09:00',
    closeTime: '22:00',
    minHours: '1',
    maxHours: '8',
  })

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  return (
    <OwnerLayout
      breadcrumbs={[
        { label: 'ダッシュボード', href: '/owner' },
        { label: '運用ルール設定' },
      ]}
    >
      <div style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
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
            運用ルール設定
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)', marginTop: 'var(--space-1)' }}>
            会議室の貸出条件・時間帯を設定します
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
            運用ルールを保存しました
          </div>
        )}

        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {/* 貸出可否 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <label
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-medium)',
                  color: 'var(--foreground)',
                }}
              >
                貸出可否
              </label>
              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                {[
                  { value: true, label: '貸出可能' },
                  { value: false, label: '貸出停止' },
                ].map((opt) => (
                  <button
                    key={String(opt.value)}
                    onClick={() => setAvailable(opt.value)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-2)',
                      padding: 'var(--space-2) var(--space-4)',
                      borderRadius: 'var(--radius-lg)',
                      border: `1px solid ${available === opt.value ? 'var(--primary)' : 'var(--border)'}`,
                      background: available === opt.value ? 'var(--primary-light)' : 'var(--background)',
                      color: available === opt.value ? 'var(--primary)' : 'var(--foreground-secondary)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: available === opt.value ? 'var(--font-semibold)' : 'var(--font-normal)',
                      cursor: 'pointer',
                      transition: 'all var(--duration-fast)',
                    }}
                  >
                    <Icon name={opt.value ? 'shield-check' : 'settings'} size={16} />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 利用可能時間帯 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <label
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-medium)',
                  color: 'var(--foreground)',
                }}
              >
                利用可能時間帯
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <input
                  type="time"
                  value={form.openTime}
                  onChange={handleChange('openTime')}
                  style={{
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
                <span style={{ color: 'var(--foreground-secondary)', fontSize: 'var(--text-sm)' }}>~</span>
                <input
                  type="time"
                  value={form.closeTime}
                  onChange={handleChange('closeTime')}
                  style={{
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
              </div>
            </div>

            {/* 最低・最大利用時間 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1-5)' }}>
                <label
                  style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-medium)',
                    color: 'var(--foreground)',
                  }}
                >
                  最低利用時間（時間）
                </label>
                <input
                  type="number"
                  value={form.minHours}
                  min={1}
                  max={24}
                  onChange={handleChange('minHours')}
                  style={{
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
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1-5)' }}>
                <label
                  style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-medium)',
                    color: 'var(--foreground)',
                  }}
                >
                  最大利用時間（時間）
                </label>
                <input
                  type="number"
                  value={form.maxHours}
                  min={1}
                  max={24}
                  onChange={handleChange('maxHours')}
                  style={{
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
              </div>
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

const meta: Meta<typeof OperationRulesPage> = {
  title: 'Pages/オーナー/運用ルール設定',
  component: OperationRulesPage,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof OperationRulesPage>

export const Default: Story = { args: { saved: false } }
export const Saved: Story = { args: { saved: true } }
