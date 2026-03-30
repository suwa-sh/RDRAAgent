import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { SettlementSummary } from './SettlementSummary'

const meta: Meta<typeof SettlementSummary> = {
  title: 'Domain/SettlementSummary',
  component: SettlementSummary,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof SettlementSummary>

export const Default: Story = {
  args: {
    revenue: 350000,
    commission: 35000,
    payout: 315000,
    period: '2026年3月',
  },
}
