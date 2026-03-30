import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { StarRating } from './StarRating'

const meta: Meta<typeof StarRating> = {
  title: 'Domain/StarRating',
  component: StarRating,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof StarRating>

export const Readonly: Story = {
  args: { value: 4.2, readonly: true },
}

export const Interactive: Story = {
  args: { value: 0, readonly: false },
}

export const HighRating: Story = {
  args: { value: 5, readonly: true },
}

export const LowRating: Story = {
  args: { value: 1, readonly: true },
}
