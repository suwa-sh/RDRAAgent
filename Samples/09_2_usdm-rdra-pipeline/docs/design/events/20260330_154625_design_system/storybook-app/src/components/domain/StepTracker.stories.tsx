import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { StepTracker } from './StepTracker'

const meta: Meta<typeof StepTracker> = {
  title: 'Domain/StepTracker',
  component: StepTracker,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof StepTracker>

export const OwnerRegistration: Story = {
  args: {
    steps: ['未登録', '申請中', '審査中', '承認済'],
    currentStep: 2,
  },
}

export const ReservationFlow: Story = {
  args: {
    steps: ['予約申請中', '予約確定', '利用中', '利用済'],
    currentStep: 1,
  },
}

export const Completed: Story = {
  args: {
    steps: ['未登録', '申請中', '審査中', '承認済'],
    currentStep: 4,
  },
}

export const FirstStep: Story = {
  args: {
    steps: ['予約申請中', '予約確定', '利用中', '利用済'],
    currentStep: 0,
  },
}
