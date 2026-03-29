import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React from 'react'
import { UserLayout } from '@/components/layout/UserLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { StarRating } from '@/components/domain/StarRating'
import { PriceDisplay } from '@/components/domain/PriceDisplay'

// ---- 型定義 ----

interface Review {
  id: string
  userName: string
  rating: number
  comment: string
  date: string
}

interface RoomDetailData {
  id: string
  name: string
  variant: 'physical' | 'virtual'
  rating: number
  reviewCount: number
  capacity: number
  pricePerHour: number
  description: string
  // 物理会議室
  location?: string
  area?: string
  floor?: string
  equipment?: string[]
  // バーチャル会議室
  toolType?: string
  maxParticipants?: number
  canRecord?: boolean
  // 運用ルール
  availableFrom: string
  availableTo: string
  minHours: number
  maxHours: number
  // オーナー
  ownerName: string
  ownerVerified: boolean
  // レビュー
  reviews: Review[]
}

// ---- モックデータ ----

const mockPhysicalRoom: RoomDetailData = {
  id: 'room-001',
  name: '大会議室A（渋谷）',
  variant: 'physical',
  rating: 4.5,
  reviewCount: 132,
  capacity: 20,
  pricePerHour: 5000,
  description:
    '渋谷駅より徒歩5分。プロジェクター・ホワイトボード完備の広々とした会議室です。スタンディングデスクも設置可能。',
  location: '東京都渋谷区桜丘町1-2',
  area: '約60m²',
  floor: '3F',
  equipment: ['プロジェクター', 'ホワイトボード', 'Wi-Fi', '空調', 'コーヒーメーカー'],
  availableFrom: '08:00',
  availableTo: '22:00',
  minHours: 1,
  maxHours: 8,
  ownerName: '渋谷スペース株式会社',
  ownerVerified: true,
  reviews: [
    { id: 'r1', userName: '田中太郎', rating: 5, comment: '設備が充実しており快適に使えました。', date: '2026-03-15' },
    { id: 'r2', userName: '佐藤花子', rating: 4, comment: 'アクセスも良く、スタッフの対応が丁寧でした。', date: '2026-03-10' },
    { id: 'r3', userName: '鈴木一郎', rating: 4, comment: 'プロジェクターの画質が良かった。', date: '2026-03-05' },
  ],
}

const mockVirtualRoom: RoomDetailData = {
  id: 'vroom-001',
  name: 'バーチャル会議室 Premium（Zoom）',
  variant: 'virtual',
  rating: 4.8,
  reviewCount: 345,
  capacity: 100,
  pricePerHour: 1500,
  description:
    '最大100名が同時接続可能なZoomベースのバーチャル会議室。録画機能付き・ブレイクアウトルーム対応。',
  toolType: 'Zoom',
  maxParticipants: 100,
  canRecord: true,
  availableFrom: '00:00',
  availableTo: '23:59',
  minHours: 1,
  maxHours: 24,
  ownerName: '山田オンラインサービス',
  ownerVerified: true,
  reviews: [
    { id: 'r1', userName: '高橋次郎', rating: 5, comment: '接続が安定していて大人数でもスムーズでした。', date: '2026-03-20' },
    { id: 'r2', userName: '伊藤美咲', rating: 5, comment: '録画機能が便利で後から共有できました。', date: '2026-03-18' },
    { id: 'r3', userName: '渡辺健', rating: 4, comment: '操作が直感的で初めてでも迷いませんでした。', date: '2026-03-12' },
  ],
}

// ---- ページコンポーネント ----

interface RoomDetailPageProps {
  room: RoomDetailData
}

const RoomDetailPage: React.FC<RoomDetailPageProps> = ({ room }) => {
  return (
    <UserLayout currentPage="search">
      <div className="flex flex-col gap-[var(--space-8)]">
        {/* パンくずリスト */}
        <nav className="flex items-center gap-[var(--space-2)] text-[var(--text-sm)]" aria-label="パンくずリスト">
          <a href="#" style={{ color: 'var(--primary)' }}>会議室検索</a>
          <span style={{ color: 'var(--foreground-muted)' }}>/</span>
          <span style={{ color: 'var(--foreground-secondary)' }}>{room.name}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-[var(--space-8)] items-start">
          {/* Main Column */}
          <div className="flex-1 min-w-0 flex flex-col gap-[var(--space-6)]">
            {/* Hero Image */}
            <div
              className="w-full rounded-[var(--radius-xl)] overflow-hidden bg-[var(--muted)] flex items-center justify-center"
              style={{ height: '320px' }}
            >
              <Icon name={room.variant === 'virtual' ? 'virtual-room' : 'room'} size={80} />
            </div>

            {/* Room Header */}
            <div className="flex flex-col gap-[var(--space-3)]">
              <div className="flex items-center gap-[var(--space-2)] flex-wrap">
                <Badge variant={room.variant === 'virtual' ? 'virtual' : 'info'}>
                  {room.variant === 'virtual' ? 'バーチャル' : '物理'}
                </Badge>
                {room.ownerVerified && (
                  <Badge variant="success">
                    <Icon name="shield-check" size={12} />
                    認証済みオーナー
                  </Badge>
                )}
              </div>
              <h1
                className="text-[var(--text-3xl)] font-[var(--font-bold)] leading-tight"
                style={{ color: 'var(--foreground)' }}
              >
                {room.name}
              </h1>
              <div className="flex items-center gap-[var(--space-4)] flex-wrap">
                <StarRating value={room.rating} count={room.reviewCount} size="md" />
                <div className="flex items-center gap-[var(--space-1)] text-[var(--text-sm)]" style={{ color: 'var(--foreground-secondary)' }}>
                  <Icon name="users" size={16} />
                  収容人数: {room.capacity}名
                </div>
              </div>
              <p className="text-[var(--text-base)] leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>
                {room.description}
              </p>
            </div>

            {/* 設備タグ */}
            {room.equipment && room.equipment.length > 0 && (
              <div className="flex flex-col gap-[var(--space-2)]">
                <h2 className="text-[var(--text-lg)] font-[var(--font-semibold)]" style={{ color: 'var(--foreground)' }}>
                  設備・機能
                </h2>
                <div className="flex flex-wrap gap-[var(--space-2)]">
                  {room.equipment.map((item) => (
                    <Badge key={item} variant="outline">{item}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* 会議室情報カード（物理） */}
            {room.variant === 'physical' && (
              <Card>
                <h2 className="text-[var(--text-lg)] font-[var(--font-semibold)] mb-[var(--space-4)]" style={{ color: 'var(--foreground)' }}>
                  会議室情報
                </h2>
                <dl className="grid grid-cols-2 gap-[var(--space-3)]">
                  {[
                    { label: '所在地',    value: room.location,  icon: 'map-pin'   as const },
                    { label: '広さ',      value: room.area,      icon: 'room'      as const },
                    { label: 'フロア',    value: room.floor,     icon: 'room'      as const },
                    { label: '収容人数',  value: `${room.capacity}名`, icon: 'users' as const },
                  ].map(({ label, value, icon }) => (
                    <div key={label} className="flex items-start gap-[var(--space-2)]">
                      <Icon name={icon} size={16} />
                      <div>
                        <dt className="text-[var(--text-xs)]" style={{ color: 'var(--foreground-muted)' }}>{label}</dt>
                        <dd className="text-[var(--text-sm)] font-[var(--font-medium)]" style={{ color: 'var(--foreground)' }}>{value}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
              </Card>
            )}

            {/* バーチャル情報カード */}
            {room.variant === 'virtual' && (
              <Card>
                <h2 className="text-[var(--text-lg)] font-[var(--font-semibold)] mb-[var(--space-4)]" style={{ color: 'var(--foreground)' }}>
                  バーチャル会議室情報
                </h2>
                <dl className="grid grid-cols-2 gap-[var(--space-3)]">
                  {[
                    { label: '会議ツール',    value: room.toolType },
                    { label: '最大接続数',    value: `${room.maxParticipants}名` },
                    { label: '録画機能',      value: room.canRecord ? '対応' : '非対応' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-start gap-[var(--space-2)]">
                      <Icon name="virtual-room" size={16} />
                      <div>
                        <dt className="text-[var(--text-xs)]" style={{ color: 'var(--foreground-muted)' }}>{label}</dt>
                        <dd className="text-[var(--text-sm)] font-[var(--font-medium)]" style={{ color: 'var(--foreground)' }}>{value}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
              </Card>
            )}

            {/* 運用ルール */}
            <Card>
              <h2 className="text-[var(--text-lg)] font-[var(--font-semibold)] mb-[var(--space-4)]" style={{ color: 'var(--foreground)' }}>
                運用ルール
              </h2>
              <dl className="grid grid-cols-2 gap-[var(--space-3)]">
                {[
                  { label: '利用可能時間',  value: `${room.availableFrom} 〜 ${room.availableTo}`, icon: 'clock' as const },
                  { label: '最低利用時間',  value: `${room.minHours}時間〜`,                       icon: 'clock' as const },
                  { label: '最大利用時間',  value: `〜${room.maxHours}時間`,                       icon: 'clock' as const },
                ].map(({ label, value, icon }) => (
                  <div key={label} className="flex items-start gap-[var(--space-2)]">
                    <Icon name={icon} size={16} />
                    <div>
                      <dt className="text-[var(--text-xs)]" style={{ color: 'var(--foreground-muted)' }}>{label}</dt>
                      <dd className="text-[var(--text-sm)] font-[var(--font-medium)]" style={{ color: 'var(--foreground)' }}>{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </Card>

            {/* レビュー一覧 */}
            <div className="flex flex-col gap-[var(--space-4)]">
              <div className="flex items-center justify-between">
                <h2 className="text-[var(--text-lg)] font-[var(--font-semibold)]" style={{ color: 'var(--foreground)' }}>
                  レビュー ({room.reviewCount}件)
                </h2>
                <StarRating value={room.rating} size="md" />
              </div>
              <div className="flex flex-col gap-[var(--space-3)]">
                {room.reviews.map((review) => (
                  <Card key={review.id}>
                    <div className="flex items-start justify-between gap-[var(--space-3)]">
                      <div className="flex items-center gap-[var(--space-3)]">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--text-sm)] font-[var(--font-semibold)]"
                          style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}
                        >
                          {review.userName[0]}
                        </div>
                        <div>
                          <p className="text-[var(--text-sm)] font-[var(--font-medium)]" style={{ color: 'var(--foreground)' }}>
                            {review.userName}
                          </p>
                          <p className="text-[var(--text-xs)]" style={{ color: 'var(--foreground-muted)' }}>
                            {review.date}
                          </p>
                        </div>
                      </div>
                      <StarRating value={review.rating} size="sm" />
                    </div>
                    <p className="text-[var(--text-sm)] mt-[var(--space-3)] leading-relaxed" style={{ color: 'var(--foreground-secondary)' }}>
                      {review.comment}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Booking Panel */}
          <aside className="w-full lg:w-80 shrink-0">
            <div className="sticky top-20">
              <Card>
                <div className="flex flex-col gap-[var(--space-4)]">
                  <div>
                    <p className="text-[var(--text-xs)]" style={{ color: 'var(--foreground-muted)' }}>時間単価</p>
                    <PriceDisplay amount={room.pricePerHour} size="lg" />
                  </div>

                  <div className="flex items-center gap-[var(--space-2)] text-[var(--text-sm)]" style={{ color: 'var(--foreground-secondary)' }}>
                    <Icon name="clock" size={16} />
                    {room.availableFrom} 〜 {room.availableTo}（最大{room.maxHours}時間）
                  </div>

                  <div className="flex items-center gap-[var(--space-2)] text-[var(--text-sm)]" style={{ color: 'var(--foreground-secondary)' }}>
                    <Icon name="users" size={16} />
                    収容人数 {room.capacity}名
                  </div>

                  <div className="flex flex-col gap-[var(--space-2)] pt-[var(--space-2)] border-t" style={{ borderColor: 'var(--border)' }}>
                    <Button size="lg" className="w-full">
                      予約する
                    </Button>
                    <Button variant="outline" size="md" className="w-full">
                      <Icon name="message" size={16} />
                      オーナーに問合せる
                    </Button>
                  </div>

                  <div className="flex items-center gap-[var(--space-2)] text-[var(--text-xs)]" style={{ color: 'var(--foreground-muted)' }}>
                    <Icon name="user" size={14} />
                    オーナー: {room.ownerName}
                    {room.ownerVerified && (
                      <Badge variant="success">
                        <Icon name="shield-check" size={10} />
                        認証済
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </aside>
        </div>
      </div>
    </UserLayout>
  )
}

// ---- Meta ----

const meta: Meta<typeof RoomDetailPage> = {
  title: 'Pages/利用者/会議室詳細',
  component: RoomDetailPage,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof RoomDetailPage>

// ---- Stories ----

export const PhysicalRoom: Story = {
  args: {
    room: mockPhysicalRoom,
  },
}

export const VirtualRoom: Story = {
  args: {
    room: mockVirtualRoom,
  },
}
