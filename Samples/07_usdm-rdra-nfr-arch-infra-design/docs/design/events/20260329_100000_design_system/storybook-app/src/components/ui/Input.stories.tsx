import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Input } from './Input'

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: {
    placeholder: '会議室名を入力してください',
  },
}

export const WithLabel: Story = {
  args: {
    label: '会議室名',
    placeholder: '例: 大会議室A',
  },
}

export const WithError: Story = {
  args: {
    label: 'メールアドレス',
    placeholder: 'example@example.com',
    error: '有効なメールアドレスを入力してください',
  },
}

export const Disabled: Story = {
  args: {
    label: '予約ID',
    value: 'RSV-2026-0001',
    disabled: true,
  },
}
