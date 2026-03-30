import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ErrorBanner } from '../../components/common/ErrorBanner'

const meta: Meta<typeof ErrorBanner> = {
  title: 'Common/ErrorBanner',
  component: ErrorBanner,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof ErrorBanner>

export const Default: Story = {
  args: { message: 'Failed to load data. Please try again.', onRetry: () => {} },
}

export const WithoutRetry: Story = {
  args: { message: 'An unexpected error occurred.' },
}
