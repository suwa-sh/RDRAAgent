import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { OwnerVerificationBadge } from './OwnerVerificationBadge'

const meta: Meta<typeof OwnerVerificationBadge> = {
  title: 'Domain/OwnerVerificationBadge',
  component: OwnerVerificationBadge,
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['unverified', 'under-review', 'verified', 'rejected', 'withdrawn'],
    },
  },
}

export default meta
type Story = StoryObj<typeof OwnerVerificationBadge>

export const Unverified: Story = {
  args: { status: 'unverified' },
}

export const UnderReview: Story = {
  args: { status: 'under-review' },
}

export const Verified: Story = {
  args: { status: 'verified' },
}

export const Rejected: Story = {
  args: { status: 'rejected' },
}

export const Withdrawn: Story = {
  args: { status: 'withdrawn' },
}
