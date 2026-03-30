import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Input } from './Input'

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof Input>

export const Default: Story = { args: { label: '名前', placeholder: '山田太郎' } }
export const WithError: Story = { args: { label: 'メールアドレス', placeholder: 'example@mail.com', error: '有効なメールアドレスを入力してください' } }
export const NoLabel: Story = { args: { placeholder: '検索キーワード' } }
