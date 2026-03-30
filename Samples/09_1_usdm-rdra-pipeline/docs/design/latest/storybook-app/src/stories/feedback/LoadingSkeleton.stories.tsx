import type { Meta, StoryObj } from '@storybook/react'
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton'

const meta: Meta<typeof LoadingSkeleton> = {
  title: 'Common/Feedback/LoadingSkeleton',
  component: LoadingSkeleton,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof LoadingSkeleton>

export const CardSkeleton: Story = {
  args: { variant: 'card', count: 4 },
}

export const TableSkeleton: Story = {
  args: { variant: 'table', count: 5 },
}

export const FormSkeleton: Story = {
  args: { variant: 'form', count: 4 },
}
