import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { RoomCard } from './RoomCard'

const meta: Meta<typeof RoomCard> = {
  title: 'Domain/RoomCard',
  component: RoomCard,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['physical', 'virtual'] },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof RoomCard>

export const PhysicalRoom: Story = {
  args: {
    name: '大会議室A',
    variant: 'physical',
    location: '東京都渋谷区 3F',
    rating: 4.3,
    reviewCount: 87,
    capacity: 20,
    pricePerHour: 5000,
  },
}

export const VirtualRoom: Story = {
  args: {
    name: 'バーチャル会議室 Premium',
    variant: 'virtual',
    toolType: 'Zoom',
    rating: 4.7,
    reviewCount: 234,
    capacity: 100,
    pricePerHour: 1500,
  },
}
