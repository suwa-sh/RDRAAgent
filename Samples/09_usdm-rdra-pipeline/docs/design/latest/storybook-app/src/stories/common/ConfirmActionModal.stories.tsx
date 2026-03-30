import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ConfirmActionModal } from '../../components/common/ConfirmActionModal'

const meta: Meta<typeof ConfirmActionModal> = {
  title: 'Common/ConfirmActionModal',
  component: ConfirmActionModal,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof ConfirmActionModal>

export const Default: Story = {
  args: {
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed?',
    onConfirm: () => {},
    onCancel: () => {},
  },
}

export const Destructive: Story = {
  args: {
    title: 'Cancel Reservation',
    message: 'This action cannot be undone. Your reservation will be permanently cancelled.',
    confirmLabel: 'Cancel Reservation',
    variant: 'destructive',
    onConfirm: () => {},
    onCancel: () => {},
  },
}
