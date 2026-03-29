import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React, { useState } from 'react'
import { OwnerLayout } from '@/components/layout/OwnerLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'

// ---- モックデータ ----

const mockRooms = [
  {
    id: 'room-001',
    name: '大会議室A（渋谷）',
    location: '東京都渋谷区桜丘町1-2 3F',
    capacity: 20,
    pricePerHour: 5000,
    published: true,
    type: 'physical' as const,
  },
  {
    id: 'room-002',
    name: '小会議室B（新宿）',
    location: '東京都新宿区西新宿3-5 8F',
    capacity: 8,
    pricePerHour: 2500,
    published: false,
    type: 'physical' as const,
  },
  {
    id: 'vroom-001',
    name: 'バーチャル会議室 Premium',
    location: 'Zoom',
    capacity: 100,
    pricePerHour: 1500,
    published: true,
    type: 'virtual' as const,
  },
  {
    id: 'room-003',
    name: 'セミナールーム（品川）',
    location: '東京都港区港南2-15 12F',
    capacity: 50,
    pricePerHour: 9800,
    published: false,
    type: 'physical' as const,
  },
]

// ---- ページコンポーネント ----

interface RoomPublishPageProps {
  initialRooms?: typeof mockRooms
}

const RoomPublishPage: React.FC<RoomPublishPageProps> = ({ initialRooms = mockRooms }) => {
  const [rooms, setRooms] = useState(initialRooms)

  const togglePublish = (id: string) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === id ? { ...r, published: !r.published } : r))
    )
  }

  const publishedCount = rooms.filter((r) => r.published).length

  return (
    <OwnerLayout
      breadcrumbs={[
        { label: 'ダッシュボード', href: '/owner' },
        { label: '会議室公開管理' },
      ]}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {/* ページタイトル */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h1
              style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: 'var(--font-bold)',
                color: 'var(--foreground)',
                margin: 0,
              }}
            >
              会議室公開管理
            </h1>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)', marginTop: 'var(--space-1)' }}>
              公開中: {publishedCount}件 / 全{rooms.length}件
            </p>
          </div>
          <Button variant="default" size="md">
            <Icon name="room" size={16} />
            会議室を追加
          </Button>
        </div>

        {/* 会議室一覧 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {rooms.map((room) => (
            <Card key={room.id}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-4)',
                }}
              >
                {/* アイコン */}
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 'var(--radius-lg)',
                    background: room.type === 'virtual' ? 'var(--virtual-light)' : 'var(--primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon name={room.type === 'virtual' ? 'virtual-room' : 'room'} size={24} />
                </div>

                {/* 会議室情報 */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        fontSize: 'var(--text-base)',
                        fontWeight: 'var(--font-semibold)',
                        color: 'var(--foreground)',
                      }}
                    >
                      {room.name}
                    </span>
                    <Badge variant={room.published ? 'success' : 'default'}>
                      {room.published ? '公開中' : '非公開'}
                    </Badge>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-4)',
                      marginTop: 'var(--space-1)',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 'var(--text-sm)',
                        color: 'var(--foreground-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-1)',
                      }}
                    >
                      <Icon name="map-pin" size={12} />
                      {room.location}
                    </span>
                    <span
                      style={{
                        fontSize: 'var(--text-sm)',
                        color: 'var(--foreground-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-1)',
                      }}
                    >
                      <Icon name="users" size={12} />
                      {room.capacity}名
                    </span>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-secondary)' }}>
                      ¥{room.pricePerHour.toLocaleString()}/時間
                    </span>
                  </div>
                </div>

                {/* 操作ボタン */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexShrink: 0 }}>
                  <Button variant="outline" size="sm">
                    <Icon name="settings" size={14} />
                    編集
                  </Button>
                  <Button
                    variant={room.published ? 'secondary' : 'default'}
                    size="sm"
                    onClick={() => togglePublish(room.id)}
                  >
                    {room.published ? '非公開にする' : '公開する'}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </OwnerLayout>
  )
}

// ---- Meta ----

const meta: Meta<typeof RoomPublishPage> = {
  title: 'Pages/オーナー/会議室公開管理',
  component: RoomPublishPage,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof RoomPublishPage>

export const Default: Story = {}
export const AllPublished: Story = {
  args: {
    initialRooms: mockRooms.map((r) => ({ ...r, published: true })),
  },
}
export const AllUnpublished: Story = {
  args: {
    initialRooms: mockRooms.map((r) => ({ ...r, published: false })),
  },
}
