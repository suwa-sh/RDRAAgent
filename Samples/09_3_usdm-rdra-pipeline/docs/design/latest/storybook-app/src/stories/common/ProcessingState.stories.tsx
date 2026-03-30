import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ProcessingState } from '../../components/common/ProcessingState'

const meta: Meta<typeof ProcessingState> = {
  title: 'Common/ProcessingState',
  component: ProcessingState,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof ProcessingState>

export const Default: Story = {
  args: { message: 'Processing your request...' },
}

export const WithProgress: Story = {
  args: { message: 'Executing settlement...', progress: 65 },
}
