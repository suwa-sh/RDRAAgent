import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ConfirmActionModal } from './ConfirmActionModal'

const meta: Meta<typeof ConfirmActionModal> = {
  title: 'Common/ConfirmActionModal',
  component: ConfirmActionModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
}
export default meta

type Story = StoryObj<typeof ConfirmActionModal>

export const Destructive: Story = {
  args: {
    title: 'オーナー退会の確認',
    message: '退会すると、登録済みの会議室情報や予約データがすべて削除されます。この操作は取り消せません。',
    confirmLabel: '退会する',
    cancelLabel: 'キャンセル',
    variant: 'destructive',
    open: true,
  },
}

export const Warning: Story = {
  args: {
    title: '予約取消の確認',
    message: 'この予約を取り消しますか？取消後の再予約は空き状況によります。',
    confirmLabel: '取消する',
    cancelLabel: '戻る',
    variant: 'warning',
    open: true,
  },
}
