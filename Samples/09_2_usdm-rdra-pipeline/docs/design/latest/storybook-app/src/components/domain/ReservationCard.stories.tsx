import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ReservationCard } from './ReservationCard'

const meta: Meta<typeof ReservationCard> = {
  title: 'Domain/ReservationCard',
  component: ReservationCard,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ReservationCard>

export const Confirmed: Story = {
  args: {
    reservationId: 'RSV-2026-0001',
    roomName: '渋谷コワーキングスペース A',
    dateTime: '2026年4月1日 10:00〜12:00',
    status: '予約確定',
    userName: '田中太郎',
  },
}

export const Pending: Story = {
  args: {
    reservationId: 'RSV-2026-0002',
    roomName: '新宿会議室 B',
    dateTime: '2026年4月5日 14:00〜16:00',
    status: '予約申請中',
    userName: '鈴木花子',
  },
}

export const Cancelled: Story = {
  args: {
    reservationId: 'RSV-2026-0003',
    roomName: '丸の内プレミアム会議室',
    dateTime: '2026年3月28日 09:00〜11:00',
    status: '取消済',
  },
}

export const List: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '28rem' }}>
      <ReservationCard reservationId="RSV-2026-0001" roomName="渋谷コワーキング A" dateTime="2026/04/01 10:00〜12:00" status="予約確定" userName="田中太郎" />
      <ReservationCard reservationId="RSV-2026-0002" roomName="新宿会議室 B" dateTime="2026/04/05 14:00〜16:00" status="予約申請中" userName="鈴木花子" />
      <ReservationCard reservationId="RSV-2026-0003" roomName="丸の内プレミアム" dateTime="2026/03/28 09:00〜11:00" status="取消済" />
    </div>
  ),
}
