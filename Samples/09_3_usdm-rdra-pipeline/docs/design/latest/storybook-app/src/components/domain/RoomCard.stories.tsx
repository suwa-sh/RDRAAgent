import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { RoomCard } from './RoomCard'

const meta: Meta<typeof RoomCard> = {
  title: 'Domain/RoomCard',
  component: RoomCard,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof RoomCard>

export const Compact: Story = {
  args: {
    name: '渋谷ヒカリエ会議室A',
    area: '30名',
    price: 5000,
    rating: 4.2,
    location: '東京都渋谷区渋谷2-21-1',
    available: true,
    variant: 'compact',
  },
}

export const Detailed: Story = {
  args: {
    name: '六本木グランドタワー 大会議室',
    area: '50名',
    price: 12000,
    rating: 4.8,
    location: '東京都港区六本木3-2-1',
    available: true,
    variant: 'detailed',
  },
}

export const Unavailable: Story = {
  args: {
    name: '品川インターシティ B棟 8F',
    area: '20名',
    price: 3500,
    rating: 3.5,
    location: '東京都港区港南2-15-1',
    available: false,
    variant: 'compact',
  },
}
