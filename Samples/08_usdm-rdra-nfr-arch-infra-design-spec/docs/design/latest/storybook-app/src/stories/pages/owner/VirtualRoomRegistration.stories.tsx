import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React, { useState } from 'react'
import { OwnerLayout } from '@/components/layout/OwnerLayout'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Icon } from '@/components/ui/Icon'

// ---- モックデータ ----

const toolOptions = [
  { id: 'zoom', label: 'Zoom', description: '最大1,000名まで対応' },
  { id: 'teams', label: 'Microsoft Teams', description: '社内連携に最適' },
  { id: 'meet', label: 'Google Meet', description: 'Googleアカウントで簡単利用' },
  { id: 'webex', label: 'Cisco Webex', description: 'エンタープライズ向け高セキュリティ' },
]

// ---- ページコンポーネント ----

interface VirtualRoomRegistrationPageProps {
  saved?: boolean
}

const VirtualRoomRegistrationPage: React.FC<VirtualRoomRegistrationPageProps> = ({ saved = false }) => {
  const [selectedTool, setSelectedTool] = useState('zoom')
  const [recordingEnabled, setRecordingEnabled] = useState(false)
  const [form, setForm] = useState({
    roomUrl: 'https://zoom.us/j/123456789',
    maxConnections: '50',
    pricePerHour: '1500',
    roomName: 'バーチャル会議室 Premium',
  })

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  return (
    <OwnerLayout
      breadcrumbs={[
        { label: 'ダッシュボード', href: '/owner' },
        { label: '会議室管理', href: '/owner/rooms' },
        { label: 'バーチャル会議室登録' },
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
            バーチャル会議室登録
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)', marginTop: 'var(--space-1)' }}>
            オンライン会議ツールを使ったバーチャル会議室を登録します
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
            バーチャル会議室を登録しました
          </div>
        )}

        {/* 会議ツール選択 */}
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
              会議ツール種別
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
              {toolOptions.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setSelectedTool(tool.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 'var(--space-3)',
                    padding: 'var(--space-3) var(--space-4)',
                    borderRadius: 'var(--radius-lg)',
                    border: `2px solid ${selectedTool === tool.id ? 'var(--primary)' : 'var(--border)'}`,
                    background: selectedTool === tool.id ? 'var(--primary-light)' : 'var(--background)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all var(--duration-fast)',
                  }}
                >
                  <Icon name="virtual-room" size={20} />
                  <div>
                    <div
                      style={{
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-semibold)',
                        color: selectedTool === tool.id ? 'var(--primary)' : 'var(--foreground)',
                      }}
                    >
                      {tool.label}
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground-secondary)', marginTop: 2 }}>
                      {tool.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* 会議室設定 */}
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <h2
              style={{
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-semibold)',
                color: 'var(--foreground)',
                margin: 0,
              }}
            >
              会議室設定
            </h2>

            <Input
              label="会議室名"
              value={form.roomName}
              onChange={handleChange('roomName')}
              placeholder="例: バーチャル会議室 Premium"
            />

            <Input
              label="会議URL"
              value={form.roomUrl}
              onChange={handleChange('roomUrl')}
              placeholder="例: https://zoom.us/j/123456789"
              type="url"
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1-5)' }}>
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--foreground)' }}>
                  同時接続数 (名)
                </label>
                <input
                  type="number"
                  value={form.maxConnections}
                  onChange={handleChange('maxConnections')}
                  min={1}
                  max={1000}
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
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--foreground)' }}>
                  利用料金 (円/時間)
                </label>
                <input
                  type="number"
                  value={form.pricePerHour}
                  onChange={handleChange('pricePerHour')}
                  min={0}
                  step={100}
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

            {/* 録画可否 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--foreground)' }}>
                録画機能
              </label>
              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                {[
                  { value: true, label: '録画可能' },
                  { value: false, label: '録画不可' },
                ].map((opt) => (
                  <button
                    key={String(opt.value)}
                    onClick={() => setRecordingEnabled(opt.value)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-2)',
                      padding: 'var(--space-2) var(--space-4)',
                      borderRadius: 'var(--radius-lg)',
                      border: `1px solid ${recordingEnabled === opt.value ? 'var(--primary)' : 'var(--border)'}`,
                      background: recordingEnabled === opt.value ? 'var(--primary-light)' : 'var(--background)',
                      color: recordingEnabled === opt.value ? 'var(--primary)' : 'var(--foreground-secondary)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: recordingEnabled === opt.value ? 'var(--font-semibold)' : 'var(--font-normal)',
                      cursor: 'pointer',
                      transition: 'all var(--duration-fast)',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {recordingEnabled && (
                <div
                  style={{
                    background: 'var(--warning-light)',
                    border: '1px solid var(--color-amber-500)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-2) var(--space-3)',
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-amber-500)',
                  }}
                >
                  録画機能を有効にした場合、利用者への事前通知が必要です
                </div>
              )}
            </div>
          </div>
        </Card>

        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
          <Button variant="outline" size="md">キャンセル</Button>
          <Button variant="default" size="md">
            <Icon name="virtual-room" size={16} />
            登録する
          </Button>
        </div>
      </div>
    </OwnerLayout>
  )
}

// ---- Meta ----

const meta: Meta<typeof VirtualRoomRegistrationPage> = {
  title: 'Pages/オーナー/バーチャル会議室登録',
  component: VirtualRoomRegistrationPage,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof VirtualRoomRegistrationPage>

export const Default: Story = { args: { saved: false } }
export const Saved: Story = { args: { saved: true } }
