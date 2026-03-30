import type { Meta, StoryObj } from '@storybook/react'
import { ConfirmActionModal } from '../../components/common/ConfirmActionModal'

const meta: Meta<typeof ConfirmActionModal> = {
  title: 'Common/Modals/ConfirmActionModal',
  component: ConfirmActionModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
}
export default meta
type Story = StoryObj<typeof ConfirmActionModal>

export const Default: Story = {
  args: {
    open: true,
    title: '予約を取り消しますか？',
    message: 'この操作は取り消せません。キャンセルポリシーに基づきキャンセル料が発生する場合があります。',
    confirmLabel: '取り消す',
    onConfirm: () => alert('取消実行'),
    onCancel: () => alert('キャンセル'),
  },
}

export const Destructive: Story = {
  args: {
    open: true,
    title: '退会しますか？',
    message: 'サービスから退会すると、全てのデータが削除されます。この操作は元に戻せません。',
    confirmLabel: '退会する',
    onConfirm: () => alert('退会実行'),
    onCancel: () => alert('キャンセル'),
    variant: 'destructive',
  },
}

export const SettlementConfirm: Story = {
  args: {
    open: true,
    title: '精算を実行しますか？',
    message: 'オーナー「鈴木花子」に150,000円を精算します。実行しますか？',
    confirmLabel: '精算を実行する',
    onConfirm: () => alert('精算実行'),
    onCancel: () => alert('キャンセル'),
  },
}
