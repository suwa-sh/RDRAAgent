import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { RoomCard } from './RoomCard'

const meta: Meta<typeof RoomCard> = {
  title: 'Domain/RoomCard',
  component: RoomCard,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof RoomCard>

export const Default: Story = {
  args: {
    roomName: '渋谷コワーキングスペース A',
    location: '渋谷区渋谷1-1-1',
    price: 3000,
    rating: 4.2,
    capacity: 20,
  },
}

export const HighRating: Story = {
  args: {
    roomName: '丸の内プレミアム会議室',
    location: '千代田区丸の内1-1-1',
    price: 8000,
    rating: 4.8,
    capacity: 50,
  },
}

export const GridView: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
      <RoomCard roomName="渋谷コワーキング A" location="渋谷区渋谷1-1" price={3000} rating={4.2} capacity={20} />
      <RoomCard roomName="新宿会議室 B" location="新宿区西新宿2-2" price={2500} rating={3.8} capacity={10} />
      <RoomCard roomName="丸の内プレミアム" location="千代田区丸の内1-1" price={8000} rating={4.8} capacity={50} />
    </div>
  ),
}
