import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ConfirmActionModal } from '@/components/common/ConfirmActionModal'

const meta = {
  title: 'Common/ConfirmActionModal',
  component: ConfirmActionModal,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'radio', options: ['default', 'destructive'] },
    isProcessing: { control: 'boolean' },
    isOpen: { control: 'boolean' },
  },
} satisfies Meta<typeof ConfirmActionModal>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    isOpen: true,
    title: '予約を確定しますか？',
    description: '渋谷カンファレンスセンター 大会議室A（2026年4月1日 10:00〜12:00）の予約を確定します。確定後はキャンセルポリシーが適用されます。',
    confirmLabel: '予約を確定する',
    cancelLabel: 'キャンセル',
    variant: 'default',
    onConfirm: () => {},
    onCancel: () => {},
    isProcessing: false,
  },
}

export const Destructive: Story = {
  args: {
    isOpen: true,
    title: '予約をキャンセルしますか？',
    description: 'この操作は取り消せません。キャンセル後はキャンセル料が発生する場合があります。本当に予約をキャンセルしますか？',
    confirmLabel: 'キャンセルする',
    cancelLabel: '戻る',
    variant: 'destructive',
    onConfirm: () => {},
    onCancel: () => {},
    isProcessing: false,
  },
}

export const Processing: Story = {
  args: {
    isOpen: true,
    title: '予約を確定しますか？',
    description: '渋谷カンファレンスセンター 大会議室A（2026年4月1日 10:00〜12:00）の予約を確定します。',
    confirmLabel: '予約を確定する',
    cancelLabel: 'キャンセル',
    variant: 'default',
    onConfirm: () => {},
    onCancel: () => {},
    isProcessing: true,
  },
}
