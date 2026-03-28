import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Card } from './Card'

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    hoverable: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  args: {
    children: 'これはカードコンポーネントです。会議室の情報やステータスを表示するために使用します。',
  },
}

export const Hoverable: Story = {
  args: {
    hoverable: true,
    children: 'ホバーすると影が変化するカードです。クリック可能な要素に使用します。',
  },
}
