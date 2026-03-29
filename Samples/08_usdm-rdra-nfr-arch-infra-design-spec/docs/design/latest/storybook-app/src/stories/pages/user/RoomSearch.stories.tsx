import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React from 'react'
import { UserLayout } from '@/components/layout/UserLayout'
import { SearchFilter } from '@/components/domain/SearchFilter'
import { RoomCard } from '@/components/domain/RoomCard'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'

// ---- モックデータ ----

const mockRooms = [
  {
    id: 'room-001',
    name: '大会議室A（渋谷）',
    variant: 'physical' as const,
    imageUrl: undefined,
    location: '東京都渋谷区桜丘町1-2 3F',
    rating: 4.5,
    reviewCount: 132,
    capacity: 20,
    pricePerHour: 5000,
  },
  {
    id: 'room-002',
    name: '小会議室B（新宿）',
    variant: 'physical' as const,
    imageUrl: undefined,
    location: '東京都新宿区西新宿3-5 8F',
    rating: 4.1,
    reviewCount: 67,
    capacity: 8,
    pricePerHour: 2500,
  },
  {
    id: 'room-003',
    name: 'セミナールーム（品川）',
    variant: 'physical' as const,
    imageUrl: undefined,
    location: '東京都港区港南2-15 12F',
    rating: 4.7,
    reviewCount: 210,
    capacity: 50,
    pricePerHour: 9800,
  },
  {
    id: 'vroom-001',
    name: 'バーチャル会議室 Premium',
    variant: 'virtual' as const,
    toolType: 'Zoom',
    rating: 4.8,
    reviewCount: 345,
    capacity: 100,
    pricePerHour: 1500,
  },
  {
    id: 'vroom-002',
    name: 'バーチャル会議室 Standard',
    variant: 'virtual' as const,
    toolType: 'Google Meet',
    rating: 4.2,
    reviewCount: 89,
    capacity: 30,
    pricePerHour: 800,
  },
]

// ---- ページコンポーネント ----

interface RoomSearchPageProps {
  loading?: boolean
  noResults?: boolean
  currentPage?: number
  totalResults?: number
}

const RoomSearchPage: React.FC<RoomSearchPageProps> = ({
  loading = false,
  noResults = false,
  currentPage = 1,
  totalResults = 5,
}) => {
  return (
    <UserLayout currentPage="search">
      <div className="flex flex-col gap-[var(--space-6)]">
        {/* Page Title */}
        <div>
          <h1
            className="text-[var(--text-2xl)] font-[var(--font-bold)]"
            style={{ color: 'var(--foreground)' }}
          >
            会議室を探す
          </h1>
          <p className="text-[var(--text-sm)] mt-[var(--space-1)]" style={{ color: 'var(--foreground-secondary)' }}>
            条件を指定して最適な会議室を見つけましょう
          </p>
        </div>

        <div className="flex gap-[var(--space-6)] items-start">
          {/* Filter Panel */}
          <aside className="w-64 shrink-0 hidden lg:block">
            <SearchFilter onSearch={() => {}} />
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0 flex flex-col gap-[var(--space-4)]">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <p className="text-[var(--text-sm)]" style={{ color: 'var(--foreground-secondary)' }}>
                {loading ? '検索中...' : noResults ? '0件の会議室が見つかりました' : `${totalResults}件の会議室が見つかりました`}
              </p>
              <div className="flex items-center gap-[var(--space-2)]">
                <Button variant="ghost" size="sm">
                  <Icon name="filter" size={14} />
                  絞り込み
                </Button>
              </div>
            </div>

            {/* Loading Skeleton */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-[var(--space-4)]">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-[var(--card-radius)] border overflow-hidden animate-pulse"
                    style={{ borderColor: 'var(--border)', background: 'var(--card-bg)' }}
                  >
                    <div
                      className="w-full"
                      style={{ height: 'var(--room-card-image-height)', background: 'var(--muted)' }}
                    />
                    <div className="p-[var(--card-padding)] flex flex-col gap-[var(--space-3)]">
                      <div
                        className="h-5 w-3/4 rounded-[var(--radius-md)]"
                        style={{ background: 'var(--muted)' }}
                      />
                      <div
                        className="h-4 w-1/2 rounded-[var(--radius-md)]"
                        style={{ background: 'var(--muted)' }}
                      />
                      <div
                        className="h-4 w-2/3 rounded-[var(--radius-md)]"
                        style={{ background: 'var(--muted)' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No Results */}
            {!loading && noResults && (
              <div
                className="flex flex-col items-center justify-center gap-[var(--space-4)] py-[var(--space-16)] rounded-[var(--card-radius)] border"
                style={{ borderColor: 'var(--border)', background: 'var(--card-bg)' }}
              >
                <Icon name="search" size={48} />
                <div className="text-center">
                  <p
                    className="text-[var(--text-lg)] font-[var(--font-semibold)]"
                    style={{ color: 'var(--foreground)' }}
                  >
                    会議室が見つかりませんでした
                  </p>
                  <p className="text-[var(--text-sm)] mt-[var(--space-1)]" style={{ color: 'var(--foreground-secondary)' }}>
                    検索条件を変更してお試しください
                  </p>
                </div>
                <Button variant="outline" size="md">
                  条件をリセット
                </Button>
              </div>
            )}

            {/* Room Card Grid */}
            {!loading && !noResults && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-[var(--space-4)]">
                {mockRooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    name={room.name}
                    variant={room.variant}
                    location={'location' in room ? room.location : undefined}
                    toolType={'toolType' in room ? room.toolType : undefined}
                    rating={room.rating}
                    reviewCount={room.reviewCount}
                    capacity={room.capacity}
                    pricePerHour={room.pricePerHour}
                    onBook={() => {}}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && !noResults && (
              <div className="flex items-center justify-center gap-[var(--space-2)] pt-[var(--space-4)]">
                <Button variant="outline" size="sm" disabled={currentPage === 1}>
                  <Icon name="map-pin" size={14} />
                  前へ
                </Button>
                {[1, 2, 3].map((page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? 'default' : 'outline'}
                    size="sm"
                  >
                    {page}
                  </Button>
                ))}
                <Button variant="outline" size="sm">
                  次へ
                  <Icon name="map-pin" size={14} />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </UserLayout>
  )
}

// ---- Meta ----

const meta: Meta<typeof RoomSearchPage> = {
  title: 'Pages/利用者/会議室検索',
  component: RoomSearchPage,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof RoomSearchPage>

// ---- Stories ----

export const Default: Story = {
  args: {
    loading: false,
    noResults: false,
    currentPage: 1,
    totalResults: 5,
  },
}

export const Loading: Story = {
  args: {
    loading: true,
    noResults: false,
    currentPage: 1,
    totalResults: 0,
  },
}

export const NoResults: Story = {
  args: {
    loading: false,
    noResults: true,
    currentPage: 1,
    totalResults: 0,
  },
}
