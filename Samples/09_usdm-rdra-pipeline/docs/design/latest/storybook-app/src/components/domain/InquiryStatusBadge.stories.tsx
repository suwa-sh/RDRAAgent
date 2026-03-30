import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { InquiryStatusBadge } from './InquiryStatusBadge'

const meta: Meta<typeof InquiryStatusBadge> = {
  title: 'Domain/InquiryStatusBadge',
  component: InquiryStatusBadge,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof InquiryStatusBadge>

export const AllStatuses: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {(['受付', '対応中', '回答済', '完了'] as const).map((s) => (
        <InquiryStatusBadge key={s} status={s} />
      ))}
    </div>
  ),
}
