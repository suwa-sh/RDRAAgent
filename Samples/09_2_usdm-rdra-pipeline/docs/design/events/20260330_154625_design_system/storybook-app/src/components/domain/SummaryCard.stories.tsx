import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { SummaryCard } from './SummaryCard'

const meta: Meta<typeof SummaryCard> = {
  title: 'Domain/SummaryCard',
  component: SummaryCard,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof SummaryCard>

export const RevenueUp: Story = {
  args: {
    label: '今月の売上',
    value: '¥1,250,000',
    change: 12.5,
    trend: 'up',
  },
}

export const BookingsDown: Story = {
  args: {
    label: '予約数',
    value: '342件',
    change: -5.2,
    trend: 'down',
  },
}

export const UsageFlat: Story = {
  args: {
    label: '稼働率',
    value: '78.5%',
    change: 0.3,
    trend: 'flat',
  },
}

export const Dashboard: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
      <SummaryCard label="今月の売上" value="¥1,250,000" change={12.5} trend="up" />
      <SummaryCard label="予約数" value="342件" change={-5.2} trend="down" />
      <SummaryCard label="稼働率" value="78.5%" change={0.3} trend="flat" />
    </div>
  ),
}
