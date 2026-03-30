import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { DashboardChart } from './DashboardChart'

const meta: Meta<typeof DashboardChart> = {
  title: 'Domain/DashboardChart',
  component: DashboardChart,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof DashboardChart>

export const BarChart: Story = {
  args: {
    title: '月別利用件数',
    type: 'bar',
    data: [
      { label: '1月', value: 120 },
      { label: '2月', value: 95 },
      { label: '3月', value: 180 },
      { label: '4月', value: 210 },
      { label: '5月', value: 160 },
      { label: '6月', value: 230 },
    ],
  },
}
