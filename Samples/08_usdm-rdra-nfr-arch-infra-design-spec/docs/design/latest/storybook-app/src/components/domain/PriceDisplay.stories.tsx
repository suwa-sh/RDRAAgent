import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { PriceDisplay } from './PriceDisplay'

const meta: Meta<typeof PriceDisplay> = {
  title: 'Domain/PriceDisplay',
  component: PriceDisplay,
  tags: ['autodocs'],
  argTypes: {
    amount: { control: 'number' },
    unit: { control: 'select', options: ['hour', 'day'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
}

export default meta
type Story = StoryObj<typeof PriceDisplay>

export const SmallSize: Story = {
  args: {
    amount: 1500,
    unit: 'hour',
    size: 'sm',
  },
}

export const MediumSize: Story = {
  args: {
    amount: 3000,
    unit: 'hour',
    size: 'md',
  },
}

export const LargeSize: Story = {
  args: {
    amount: 5000,
    unit: 'hour',
    size: 'lg',
  },
}

export const Hourly: Story = {
  args: {
    amount: 2500,
    unit: 'hour',
    size: 'md',
  },
}

export const Daily: Story = {
  args: {
    amount: 15000,
    unit: 'day',
    size: 'md',
  },
}

export const LargeAmount: Story = {
  args: {
    amount: 120000,
    unit: 'day',
    size: 'lg',
  },
}
