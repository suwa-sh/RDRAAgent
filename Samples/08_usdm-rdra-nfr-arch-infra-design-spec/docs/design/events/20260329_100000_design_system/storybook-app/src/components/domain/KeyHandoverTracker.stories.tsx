import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { KeyHandoverTracker } from './KeyHandoverTracker'

const meta: Meta<typeof KeyHandoverTracker> = {
  title: 'Domain/KeyHandoverTracker',
  component: KeyHandoverTracker,
  tags: ['autodocs'],
  argTypes: {
    currentStep: {
      control: 'select',
      options: ['lent', 'in-use', 'returned'],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 400 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof KeyHandoverTracker>

export const Lent: Story = {
  args: {
    currentStep: 'lent',
    lentAt: '2026年4月1日 09:00',
    returnDue: '2026年4月1日 18:00',
  },
}

export const InUse: Story = {
  args: {
    currentStep: 'in-use',
    lentAt: '2026年4月1日 09:00',
    returnDue: '2026年4月1日 18:00',
  },
}

export const Returned: Story = {
  args: {
    currentStep: 'returned',
    lentAt: '2026年4月1日 09:00',
    returnDue: '2026年4月1日 18:00',
    returnedAt: '2026年4月1日 17:30',
  },
}
