import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { PriceDisplay } from './PriceDisplay'

const meta: Meta<typeof PriceDisplay> = {
  title: 'Domain/PriceDisplay',
  component: PriceDisplay,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof PriceDisplay>

export const Default: Story = {
  args: { amount: 3000, suffix: '/時間' },
}

export const WithDiscount: Story = {
  args: { amount: 2500, originalAmount: 3000, suffix: '/時間' },
}

export const Large: Story = {
  args: { amount: 150000, size: 'lg', suffix: '/月' },
}

export const Small: Story = {
  args: { amount: 1500, size: 'sm', suffix: '/時間' },
}
