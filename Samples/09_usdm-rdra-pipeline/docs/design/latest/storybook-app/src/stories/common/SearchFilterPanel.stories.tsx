import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { SearchFilterPanel } from '../../components/common/SearchFilterPanel'

const meta: Meta<typeof SearchFilterPanel> = {
  title: 'Common/SearchFilterPanel',
  component: SearchFilterPanel,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof SearchFilterPanel>

export const Default: Story = {
  args: {
    filters: [
      { key: 'keyword', label: 'Keyword', type: 'text', placeholder: 'Search...' },
      { key: 'area', label: 'Area (sqm)', type: 'number', placeholder: '30' },
      { key: 'price', label: 'Price (JPY)', type: 'number', placeholder: '3000' },
    ],
  },
}
