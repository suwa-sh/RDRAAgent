import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React from 'react'
import { UserPortalShell } from '@/components/layout/UserPortalShell'
import { SearchFilter } from '@/components/domain/SearchFilter'
import { RoomCard } from '@/components/domain/RoomCard'

const meta: Meta = {
  title: 'Pages/User/会議室検索画面',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj

const sampleRooms = [
  { roomName: 'コワーキングスペース渋谷A', location: '東京都渋谷区道玄坂1-2-3', price: 3000, rating: 4.5, capacity: 20 },
  { roomName: '新宿ミーティングルームB', location: '東京都新宿区西新宿2-8-1', price: 5000, rating: 4.2, capacity: 10 },
  { roomName: '六本木カンファレンスC', location: '東京都港区六本木6-10-1', price: 8000, rating: 4.8, capacity: 50 },
  { roomName: '品川セミナールームD', location: '東京都品川区東品川4-12-4', price: 4500, rating: 3.9, capacity: 30 },
]

export const Default: Story = {
  render: () => (
    <UserPortalShell currentPage="search">
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--foreground)', marginBottom: 'var(--spacing-4)' }}>
        会議室を探す
      </h1>
      <div style={{ marginBottom: 'var(--spacing-6)' }}>
        <SearchFilter />
      </div>
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(18rem, 1fr))' }}>
        {sampleRooms.map((room, i) => (
          <RoomCard key={i} {...room} />
        ))}
      </div>
    </UserPortalShell>
  ),
}
