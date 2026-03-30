import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { KeyStatusBadge } from './KeyStatusBadge'

const meta: Meta<typeof KeyStatusBadge> = {
  title: 'Domain/KeyStatusBadge',
  component: KeyStatusBadge,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof KeyStatusBadge>

export const Lending: Story = { args: { status: '貸出中' } }
export const Returned: Story = { args: { status: '返却済' } }

export const AllStatuses: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <KeyStatusBadge status="貸出中" />
      <KeyStatusBadge status="返却済" />
    </div>
  ),
}
