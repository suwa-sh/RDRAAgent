import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { StarRating } from './StarRating'

const meta: Meta<typeof StarRating> = {
  title: 'Domain/StarRating',
  component: StarRating,
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 5, step: 0.1 } },
    count: { control: 'number' },
    readOnly: { control: 'boolean' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
}

export default meta
type Story = StoryObj<typeof StarRating>

export const ReadOnly: Story = {
  args: {
    value: 4.2,
    readOnly: true,
    size: 'md',
  },
}

export const Interactive: Story = {
  args: {
    value: 3,
    readOnly: false,
    size: 'md',
  },
}

export const Small: Story = {
  args: {
    value: 3.8,
    readOnly: true,
    size: 'sm',
  },
}

export const Large: Story = {
  args: {
    value: 4.5,
    readOnly: true,
    size: 'lg',
  },
}

export const WithCount: Story = {
  args: {
    value: 4.3,
    count: 128,
    readOnly: true,
    size: 'md',
  },
}
