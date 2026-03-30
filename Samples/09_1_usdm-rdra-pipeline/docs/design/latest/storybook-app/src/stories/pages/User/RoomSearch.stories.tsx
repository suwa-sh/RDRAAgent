import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { SearchFilter } from '../../../components/domain/SearchFilter'
import { RoomCard } from '../../../components/domain/RoomCard'
import { EmptyState } from '../../../components/common/EmptyState'

const sampleRooms = [
  {
    roomName: '新宿会議室A',
    price: 3000,
    rating: 4.5,
    features: ['Wi-Fi', 'プロジェクター', 'ホワイトボード'],
    address: '東京都新宿区西新宿1-1-1',
    capacity: 10,
  },
  {
    roomName: '渋谷会議室B',
    price: 2000,
    rating: 4.0,
    features: ['Wi-Fi', 'テレビ会議設備'],
    address: '東京都渋谷区道玄坂2-2-2',
    capacity: 6,
  },
  {
    roomName: '池袋会議室C',
    price: 1500,
    rating: 3.5,
    features: ['Wi-Fi'],
    address: '東京都豊島区東池袋3-3-3',
    capacity: 4,
  },
  {
    roomName: '品川会議室D',
    price: 5000,
    rating: 4.8,
    features: ['Wi-Fi', 'プロジェクター', 'ホワイトボード', 'テレビ会議設備'],
    address: '東京都港区港南4-4-4',
    capacity: 20,
  },
]

const RoomSearchPage: React.FC<{ rooms?: typeof sampleRooms; empty?: boolean }> = ({
  rooms = sampleRooms,
  empty = false,
}) => {
  return (
    <div style={{ backgroundColor: 'var(--background)', minHeight: '100vh' }}>
      {/* Header */}
      <header
        className="flex items-center justify-between px-6 h-16"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold" style={{ color: 'var(--primary)' }}>
            RoomConnect
          </span>
          <nav className="flex gap-2">
            <span className="px-3 py-1 rounded text-sm font-medium" style={{ color: 'var(--primary)', backgroundColor: 'var(--muted)' }}>
              会議室検索
            </span>
            <span className="px-3 py-1 rounded text-sm" style={{ color: 'var(--muted-foreground)' }}>
              予約一覧
            </span>
            <span className="px-3 py-1 rounded text-sm" style={{ color: 'var(--muted-foreground)' }}>
              問合せ
            </span>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm" style={{ color: 'var(--foreground)' }}>田中太郎</span>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>
          会議室を検索
        </h1>

        {/* Search Filter */}
        <div className="mb-6">
          <SearchFilter
            features={['Wi-Fi', 'プロジェクター', 'ホワイトボード', 'テレビ会議設備']}
            priceRange={{ min: 0, max: 10000 }}
            minRating={0}
          />
        </div>

        {/* Results */}
        {empty ? (
          <EmptyState
            title="条件に一致する会議室が見つかりませんでした"
            description="検索条件を変更して再度お試しください。"
            actionLabel="条件をリセット"
            onAction={() => {}}
          />
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                {rooms.length} 件の会議室が見つかりました
              </span>
            </div>
            <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
              {rooms.map((room, i) => (
                <RoomCard key={i} {...room} />
              ))}
            </div>
            {/* Pagination */}
            <div className="flex justify-center gap-2 mt-8">
              <button className="px-3 py-1 rounded text-sm" style={{ border: '1px solid var(--border)', color: 'var(--muted-foreground)' }}>
                前へ
              </button>
              <button className="px-3 py-1 rounded text-sm font-medium" style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}>
                1
              </button>
              <button className="px-3 py-1 rounded text-sm" style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}>
                2
              </button>
              <button className="px-3 py-1 rounded text-sm" style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}>
                次へ
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

const meta: Meta<typeof RoomSearchPage> = {
  title: 'Pages/User/会議室検索',
  component: RoomSearchPage,
  parameters: {
    layout: 'fullscreen',
  },
}
export default meta
type Story = StoryObj<typeof RoomSearchPage>

export const Default: Story = {
  args: {},
}

export const EmptyResults: Story = {
  args: {
    empty: true,
  },
}
