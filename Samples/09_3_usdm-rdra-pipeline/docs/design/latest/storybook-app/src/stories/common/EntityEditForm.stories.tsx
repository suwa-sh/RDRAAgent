import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { EntityEditForm } from '../../components/common/EntityEditForm'

const meta: Meta<typeof EntityEditForm> = {
  title: 'Common/EntityEditForm',
  component: EntityEditForm,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof EntityEditForm>

export const Default: Story = {
  args: {
    fields: [
      { key: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Your name' },
      { key: 'email', label: 'Email', type: 'email', required: true, placeholder: 'user@example.com' },
      { key: 'phone', label: 'Phone', type: 'tel', placeholder: '090-1234-5678' },
      { key: 'note', label: 'Notes', type: 'textarea', placeholder: 'Additional info' },
    ],
    submitLabel: 'Save',
  },
}
