import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React, { useState } from 'react'
import { OwnerLayout } from '@/components/layout/OwnerLayout'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'

// ---- モックデータ ----

const mockRoom = {
  name: '大会議室A（渋谷）',
  location: '東京都渋谷区桜丘町1-2 3F',
  area: '80',
  capacity: '20',
  pricePerHour: '5000',
  equipment: '大型モニター, ホワイトボード, Web会議システム, プロジェクター',
  description: '渋谷駅徒歩5分の好立地。大型モニターとWeb会議システムを完備した清潔感のある会議室です。',
}

// ---- ページコンポーネント ----

interface RoomEditPageProps {
  saved?: boolean
}

const RoomEditPage: React.FC<RoomEditPageProps> = ({ saved = false }) => {
  const [form, setForm] = useState(mockRoom)

  const handleChange = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  return (
    <OwnerLayout
      breadcrumbs={[
        { label: 'ダッシュボード', href: '/owner' },
        { label: '会議室管理', href: '/owner/rooms' },
        { label: '会議室情報変更' },
      ]}
    >
      <div style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
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
            会議室情報変更
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)', marginTop: 'var(--space-1)' }}>
            会議室の基本情報・設備情報を編集します
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
            会議室情報を保存しました
          </div>
        )}

        {/* 基本情報 */}
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <h2
              style={{
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-semibold)',
                color: 'var(--foreground)',
                margin: 0,
                paddingBottom: 'var(--space-3)',
                borderBottom: '1px solid var(--border)',
              }}
            >
              基本情報
            </h2>

            <Input
              label="会議室名"
              value={form.name}
              onChange={handleChange('name')}
              placeholder="例: 大会議室A（渋谷）"
            />

            <Input
              label="所在地"
              value={form.location}
              onChange={handleChange('location')}
              placeholder="例: 東京都渋谷区桜丘町1-2 3F"
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1-5)' }}>
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--foreground)' }}>
                  広さ (m²)
                </label>
                <input
                  type="number"
                  value={form.area}
                  onChange={handleChange('area')}
                  min={1}
                  placeholder="例: 80"
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
                  収容人数 (名)
                </label>
                <input
                  type="number"
                  value={form.capacity}
                  onChange={handleChange('capacity')}
                  min={1}
                  placeholder="例: 20"
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1-5)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--foreground)' }}>
                利用料金 (円/時間)
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <span style={{ fontSize: 'var(--text-base)', color: 'var(--foreground-secondary)' }}>¥</span>
                <input
                  type="number"
                  value={form.pricePerHour}
                  onChange={handleChange('pricePerHour')}
                  min={0}
                  step={100}
                  placeholder="例: 5000"
                  style={{
                    height: 'var(--input-height)',
                    padding: '0 var(--input-px)',
                    borderRadius: 'var(--input-radius)',
                    border: '1px solid var(--input-border)',
                    fontSize: 'var(--input-font-size)',
                    background: 'var(--background)',
                    color: 'var(--foreground)',
                    outline: 'none',
                    width: 200,
                  }}
                />
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)' }}>/時間</span>
              </div>
            </div>
          </div>
        </Card>

        {/* 設備・説明 */}
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <h2
              style={{
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-semibold)',
                color: 'var(--foreground)',
                margin: 0,
                paddingBottom: 'var(--space-3)',
                borderBottom: '1px solid var(--border)',
              }}
            >
              設備・説明
            </h2>

            <Input
              label="設備（カンマ区切り）"
              value={form.equipment}
              onChange={handleChange('equipment')}
              placeholder="例: 大型モニター, ホワイトボード, Web会議システム"
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1-5)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--foreground)' }}>
                会議室説明
              </label>
              <textarea
                value={form.description}
                onChange={handleChange('description')}
                rows={4}
                placeholder="会議室の特徴・アクセスなどを入力してください"
                style={{
                  padding: 'var(--input-py) var(--input-px)',
                  borderRadius: 'var(--input-radius)',
                  border: '1px solid var(--input-border)',
                  fontSize: 'var(--input-font-size)',
                  background: 'var(--background)',
                  color: 'var(--foreground)',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  lineHeight: 1.6,
                }}
              />
            </div>
          </div>
        </Card>

        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
          <Button variant="outline" size="md">キャンセル</Button>
          <Button variant="default" size="md">
            <Icon name="shield-check" size={16} />
            変更を保存
          </Button>
        </div>
      </div>
    </OwnerLayout>
  )
}

// ---- Meta ----

const meta: Meta<typeof RoomEditPage> = {
  title: 'Pages/オーナー/会議室情報変更',
  component: RoomEditPage,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof RoomEditPage>

export const Default: Story = { args: { saved: false } }
export const Saved: Story = { args: { saved: true } }
