import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { PriceDisplay } from './PriceDisplay'

const meta: Meta<typeof PriceDisplay> = {
  title: 'Domain/PriceDisplay',
  component: PriceDisplay,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof PriceDisplay>

export const Small: Story = { args: { amount: 3500, size: 'sm' } }
export const Medium: Story = { args: { amount: 12000, size: 'md' } }
export const Large: Story = { args: { amount: 150000, size: 'lg' } }
