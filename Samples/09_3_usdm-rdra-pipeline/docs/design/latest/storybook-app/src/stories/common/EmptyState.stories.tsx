import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { EmptyState } from '../../components/common/EmptyState'
import { Button } from '../../components/ui/Button'
import { Icon } from '../../components/ui/Icon'

const meta: Meta<typeof EmptyState> = {
  title: 'Common/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof EmptyState>

export const Default: Story = {
  args: {
    title: 'No data found',
    description: 'Try changing your search criteria.',
  },
}

export const WithAction: Story = {
  args: {
    title: 'No rooms registered',
    description: 'Register your first meeting room to get started.',
    action: <Button>Register Room</Button>,
  },
}

export const WithIcon: Story = {
  render: () => (
    <EmptyState
      title="No reviews yet"
      description="Reviews will appear here after your first booking."
      action={<Icon name="star" size={48} />}
    />
  ),
}
