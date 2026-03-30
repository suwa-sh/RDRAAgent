import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { SearchFilter } from './SearchFilter'

const meta: Meta<typeof SearchFilter> = {
  title: 'Domain/SearchFilter',
  component: SearchFilter,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof SearchFilter>

export const Default: Story = { args: {} }
