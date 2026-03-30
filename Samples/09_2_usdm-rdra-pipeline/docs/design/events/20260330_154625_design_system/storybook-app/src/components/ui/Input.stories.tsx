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
  args: {
    label: '会議室名',
    placeholder: '例: 渋谷コワーキングスペース',
  },
}

export const WithError: Story = {
  args: {
    label: 'メールアドレス',
    placeholder: 'example@roomconnect.jp',
    error: '有効なメールアドレスを入力してください',
    defaultValue: 'invalid-email',
  },
}

export const WithoutLabel: Story = {
  args: {
    placeholder: '検索キーワードを入力...',
  },
}

export const Disabled: Story = {
  args: {
    label: 'オーナーID',
    value: 'OWN-001',
    disabled: true,
  },
}
