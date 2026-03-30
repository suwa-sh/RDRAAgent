import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { PaginatedList } from '../../components/common/PaginatedList'
import { Card } from '../../components/ui/Card'

const meta: Meta<typeof PaginatedList> = {
  title: 'Common/PaginatedList',
  component: PaginatedList,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof PaginatedList>

export const Default: Story = {
  args: {
    items: Array.from({ length: 5 }, (_, i) => (
      <Card key={i}><div style={{ padding: '12px' }}>Item {i + 1}</div></Card>
    )),
    page: 2,
    totalPages: 5,
  },
}
