import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { LoadingSkeleton } from './LoadingSkeleton'

const meta: Meta<typeof LoadingSkeleton> = {
  title: 'Common/LoadingSkeleton',
  component: LoadingSkeleton,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof LoadingSkeleton>

export const Card: Story = {
  args: { variant: 'card', count: 3 },
}

export const Table: Story = {
  args: { variant: 'table', count: 5 },
}

export const Form: Story = {
  args: { variant: 'form', count: 1 },
}

export const List: Story = {
  args: { variant: 'list', count: 4 },
}
