import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { SearchFilter } from './SearchFilter'

const meta: Meta<typeof SearchFilter> = {
  title: 'Domain/SearchFilter',
  component: SearchFilter,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 400 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof SearchFilter>

export const Default: Story = {
  args: {
    onSearch: (filters) => {
      console.log('検索条件:', filters)
    },
  },
}
