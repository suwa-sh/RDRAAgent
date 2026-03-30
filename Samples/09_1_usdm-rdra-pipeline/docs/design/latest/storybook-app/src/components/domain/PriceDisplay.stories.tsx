import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { PriceDisplay } from './PriceDisplay'

const meta: Meta<typeof PriceDisplay> = {
  title: 'Domain/PriceDisplay',
  component: PriceDisplay,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof PriceDisplay>

export const Default: Story = { args: { amount: 5000, suffix: '/時間' } }
export const Large: Story = { args: { amount: 1250000, size: 'lg' } }
export const Small: Story = { args: { amount: 800, size: 'sm', suffix: '/時間' } }
