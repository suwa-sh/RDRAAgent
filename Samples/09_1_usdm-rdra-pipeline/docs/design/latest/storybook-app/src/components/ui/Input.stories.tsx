import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Input } from './Input'

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: { label: '会議室名', placeholder: '例: 渋谷コワーキングスペースA' },
}

export const WithError: Story = {
  args: { label: 'メールアドレス', placeholder: 'user@example.com', error: '有効なメールアドレスを入力してください', value: 'invalid' },
}

export const WithoutLabel: Story = {
  args: { placeholder: '検索キーワードを入力...' },
}
