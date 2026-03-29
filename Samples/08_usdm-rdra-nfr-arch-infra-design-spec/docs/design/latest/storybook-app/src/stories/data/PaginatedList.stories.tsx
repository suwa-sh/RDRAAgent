import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React from 'react'
import { PaginatedList } from '@/components/common/PaginatedList'
import { RoomCard } from '@/components/domain/RoomCard'
import { Badge } from '@/components/ui/Badge'

// ---- テーブルモード用モックデータ ----

const ownerReviewHeaders = ['申請者名', '申請日', '会議室数', '審査状態', '担当者']

const ownerReviewRows = [
  ['鈴木 一郎', '2026-03-01', '3室', '審査待ち', '山田管理者'],
  ['田中 美咲', '2026-03-05', '1室', '審査中', '山田管理者'],
  ['佐藤 健太', '2026-03-08', '2室', '承認済み', '—'],
  ['中村 裕子', '2026-03-12', '4室', '審査待ち', '未割当'],
  ['伊藤 浩二', '2026-03-15', '1室', '否認', '山田管理者'],
]

// ---- カードモード用モックデータ ----

const mockRoomCards = [
  <RoomCard
    key="room-1"
    name="大会議室A（渋谷）"
    variant="physical"
    location="東京都渋谷区桜丘町1-2 3F"
    rating={4.5}
    reviewCount={132}
    capacity={20}
    pricePerHour={5000}
  />,
  <RoomCard
    key="room-2"
    name="小会議室B（新宿）"
    variant="physical"
    location="東京都新宿区西新宿3-5 8F"
    rating={4.1}
    reviewCount={67}
    capacity={8}
    pricePerHour={2500}
  />,
  <RoomCard
    key="room-3"
    name="セミナールーム（品川）"
    variant="physical"
    location="東京都港区港南2-15 12F"
    rating={4.7}
    reviewCount={210}
    capacity={50}
    pricePerHour={9800}
  />,
  <RoomCard
    key="vroom-1"
    name="バーチャル会議室 Premium"
    variant="virtual"
    toolType="Zoom"
    rating={4.8}
    reviewCount={345}
    capacity={100}
    pricePerHour={1500}
  />,
  <RoomCard
    key="vroom-2"
    name="バーチャル会議室 Standard"
    variant="virtual"
    toolType="Google Meet"
    rating={4.2}
    reviewCount={89}
    capacity={30}
    pricePerHour={800}
  />,
  <RoomCard
    key="vroom-3"
    name="バーチャル会議室 Teams Pro"
    variant="virtual"
    toolType="Teams"
    rating={4.0}
    reviewCount={56}
    capacity={50}
    pricePerHour={1200}
  />,
]

// ---- Meta ----

const meta: Meta<typeof PaginatedList> = {
  title: 'Common/PaginatedList',
  component: PaginatedList,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    onPageChange: { action: 'ページ変更' },
  },
}

export default meta
type Story = StoryObj<typeof PaginatedList>

// ---- Stories ----

export const TableMode: Story = {
  name: 'TableMode — オーナー審査一覧',
  args: {
    variant: 'table',
    headers: ownerReviewHeaders,
    rows: ownerReviewRows,
    total: 15,
    page: 1,
    perPage: 5,
    isLoading: false,
  },
}

export const CardMode: Story = {
  name: 'CardMode — 会議室検索結果',
  args: {
    variant: 'card',
    cards: mockRoomCards,
    total: 26,
    page: 1,
    perPage: 6,
    isLoading: false,
  },
}

export const LoadingTable: Story = {
  name: 'Loading — テーブル読込中',
  args: {
    variant: 'table',
    headers: ownerReviewHeaders,
    rows: [],
    total: 0,
    page: 1,
    perPage: 5,
    isLoading: true,
  },
}

export const LoadingCard: Story = {
  name: 'Loading — カード読込中',
  args: {
    variant: 'card',
    cards: [],
    total: 0,
    page: 1,
    perPage: 6,
    isLoading: true,
  },
}

export const EmptyTable: Story = {
  name: 'Empty — テーブル空状態',
  args: {
    variant: 'table',
    headers: ownerReviewHeaders,
    rows: [],
    total: 0,
    page: 1,
    perPage: 5,
    isLoading: false,
    emptyMessage: '審査待ちのオーナー申請はありません',
  },
}

export const EmptyCard: Story = {
  name: 'Empty — カード空状態',
  args: {
    variant: 'card',
    cards: [],
    total: 0,
    page: 1,
    perPage: 6,
    isLoading: false,
    emptyMessage: '条件に一致する会議室が見つかりませんでした',
  },
}
