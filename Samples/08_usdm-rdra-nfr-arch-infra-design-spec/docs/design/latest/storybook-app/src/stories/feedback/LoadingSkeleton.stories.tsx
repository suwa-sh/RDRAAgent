import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'

const meta = {
  title: 'Common/LoadingSkeleton',
  component: LoadingSkeleton,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['card', 'table-row', 'detail', 'form'],
    },
    count: { control: { type: 'number', min: 1, max: 10 } },
  },
} satisfies Meta<typeof LoadingSkeleton>

export default meta
type Story = StoryObj<typeof meta>

export const CardSkeleton: Story = {
  args: { variant: 'card' },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
}

export const TableRowSkeleton: Story = {
  args: { variant: 'table-row', count: 5 },
}

export const DetailSkeleton: Story = {
  args: { variant: 'detail' },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 640 }}>
        <Story />
      </div>
    ),
  ],
}

export const FormSkeleton: Story = {
  args: { variant: 'form', count: 4 },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480 }}>
        <Story />
      </div>
    ),
  ],
}
