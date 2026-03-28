import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { SettlementSummaryCard } from './SettlementSummaryCard'

const meta: Meta<typeof SettlementSummaryCard> = {
  title: 'Domain/SettlementSummaryCard',
  component: SettlementSummaryCard,
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['calculating', 'confirmed', 'paid', 'failed'],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 400 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof SettlementSummaryCard>

export const Confirmed: Story = {
  args: {
    month: '2026年3月',
    status: 'confirmed',
    totalUsageFee: 450000,
    commissionRate: 10,
    commissionAmount: 45000,
    settlementAmount: 405000,
    paymentDate: '2026年4月15日',
  },
}

export const Paid: Story = {
  args: {
    month: '2026年2月',
    status: 'paid',
    totalUsageFee: 380000,
    commissionRate: 10,
    commissionAmount: 38000,
    settlementAmount: 342000,
    paymentDate: '2026年3月15日',
  },
}
