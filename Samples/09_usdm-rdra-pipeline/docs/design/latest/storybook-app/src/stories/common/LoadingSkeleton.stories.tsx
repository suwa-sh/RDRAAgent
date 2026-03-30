import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton'

const meta: Meta<typeof LoadingSkeleton> = {
  title: 'Common/LoadingSkeleton',
  component: LoadingSkeleton,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof LoadingSkeleton>

export const CardVariant: Story = { args: { variant: 'card', count: 3 } }
export const TableVariant: Story = { args: { variant: 'table', count: 5 } }
export const FormVariant: Story = { args: { variant: 'form', count: 4 } }
