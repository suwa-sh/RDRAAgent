import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { RoomCard } from './RoomCard'

const meta: Meta<typeof RoomCard> = {
  title: 'Domain/RoomCard',
  component: RoomCard,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof RoomCard>

const sampleProps = {
  roomName: '渋谷スカイ 会議室A',
  price: 5000,
  rating: 4.2,
  features: ['プロジェクター', 'Wi-Fi', 'ホワイトボード'],
  address: '東京都渋谷区神南1-2-3',
  capacity: 20,
}

export const Grid: Story = { args: { ...sampleProps, variant: 'grid' } }
export const List: Story = { args: { ...sampleProps, variant: 'list' } }

export const GridLayout: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', maxWidth: '960px' }}>
      <RoomCard {...sampleProps} />
      <RoomCard roomName="新宿パーク 会議室B" price={3500} rating={3.8} features={['Wi-Fi', 'テレビ会議設備']} address="東京都新宿区西新宿2-1-1" capacity={10} />
      <RoomCard roomName="品川ベイ 会議室C" price={8000} rating={4.7} features={['プロジェクター', 'ホワイトボード', 'Wi-Fi', 'テレビ会議設備']} address="東京都港区港南2-3-4" capacity={50} />
    </div>
  ),
}
