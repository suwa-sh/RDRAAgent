import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { SummaryCard } from './SummaryCard'

const meta: Meta<typeof SummaryCard> = {
  title: 'Domain/SummaryCard',
  component: SummaryCard,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof SummaryCard>

export const Revenue: Story = {
  args: {
    title: '月間手数料売上',
    value: '¥1,250,000',
    change: { value: '+12.5%', positive: true },
    icon: 'chart',
  },
}

export const Usage: Story = {
  args: {
    title: '月間利用件数',
    value: '342件',
    change: { value: '-3.2%', positive: false },
    icon: 'room',
  },
}

export const Dashboard: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', maxWidth: '720px' }}>
      <SummaryCard title="月間手数料売上" value="¥1,250,000" change={{ value: '+12.5%', positive: true }} icon="chart" />
      <SummaryCard title="月間利用件数" value="342件" change={{ value: '+8.1%', positive: true }} icon="room" />
      <SummaryCard title="登録オーナー数" value="128名" change={{ value: '+5名', positive: true }} icon="user" />
    </div>
  ),
}
