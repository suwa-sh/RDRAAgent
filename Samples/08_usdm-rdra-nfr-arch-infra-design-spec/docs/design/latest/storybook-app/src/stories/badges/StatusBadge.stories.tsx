import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { StatusBadge, type StatusBadgeModel } from '@/components/common/StatusBadge'

const meta = {
  title: 'Common/StatusBadge',
  component: StatusBadge,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    model: {
      control: 'select',
      options: ['owner', 'room', 'reservation', 'inquiry', 'settlement', 'payment', 'key'],
    },
    size: { control: 'radio', options: ['sm', 'md'] },
  },
} satisfies Meta<typeof StatusBadge>

export default meta
type Story = StoryObj<typeof meta>

export const OwnerPending: Story = {
  args: { model: 'owner', status: '審査待ち' },
}

export const OwnerRegistered: Story = {
  args: { model: 'owner', status: '登録済み' },
}

export const OwnerRejected: Story = {
  args: { model: 'owner', status: '却下' },
}

export const OwnerWithdrawn: Story = {
  args: { model: 'owner', status: '退会' },
}

export const RoomPrivate: Story = {
  args: { model: 'room', status: '非公開' },
}

export const RoomAvailable: Story = {
  args: { model: 'room', status: '公開可能' },
}

export const RoomPublic: Story = {
  args: { model: 'room', status: '公開中' },
}

export const ReservationApplied: Story = {
  args: { model: 'reservation', status: '申請' },
}

export const ReservationConfirmed: Story = {
  args: { model: 'reservation', status: '確定' },
}

export const ReservationChanged: Story = {
  args: { model: 'reservation', status: '変更' },
}

export const ReservationCancelled: Story = {
  args: { model: 'reservation', status: '取消' },
}

export const InquiryPending: Story = {
  args: { model: 'inquiry', status: '未対応' },
}

export const InquiryReplied: Story = {
  args: { model: 'inquiry', status: '回答済み' },
}

export const InquiryResolved: Story = {
  args: { model: 'inquiry', status: '対応済み' },
}

export const SettlementPending: Story = {
  args: { model: 'settlement', status: '未精算' },
}

export const SettlementCalculated: Story = {
  args: { model: 'settlement', status: '精算計算済み' },
}

export const SettlementPaid: Story = {
  args: { model: 'settlement', status: '支払済み' },
}

export const PaymentNotRegistered: Story = {
  args: { model: 'payment', status: '未登録' },
}

export const PaymentRegistered: Story = {
  args: { model: 'payment', status: '決済手段登録済み' },
}

export const PaymentDeducted: Story = {
  args: { model: 'payment', status: '引き落とし済み' },
}

export const KeyStored: Story = {
  args: { model: 'key', status: '保管中' },
}

export const KeyLent: Story = {
  args: { model: 'key', status: '貸出中' },
}

type ModelEntry = {
  model: StatusBadgeModel
  label: string
  statuses: string[]
}

const allModels: ModelEntry[] = [
  { model: 'owner',       label: 'オーナー', statuses: ['審査待ち', '登録済み', '却下', '退会'] },
  { model: 'room',        label: '会議室',   statuses: ['非公開', '公開可能', '公開中'] },
  { model: 'reservation', label: '予約',     statuses: ['申請', '確定', '変更', '取消'] },
  { model: 'inquiry',     label: '問合せ',   statuses: ['未対応', '回答済み', '対応済み'] },
  { model: 'settlement',  label: '精算',     statuses: ['未精算', '精算計算済み', '支払済み'] },
  { model: 'payment',     label: '決済',     statuses: ['未登録', '決済手段登録済み', '引き落とし済み'] },
  { model: 'key',         label: '鍵',       statuses: ['保管中', '貸出中'] },
]

export const AllModels: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', minWidth: 480 }}>
      {allModels.map(({ model, label, statuses }) => (
        <div key={model}>
          <p style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--font-semibold)',
            color: 'var(--foreground-secondary)',
            marginBottom: 'var(--space-2)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            {label}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            {statuses.map((status) => (
              <StatusBadge key={status} model={model} status={status} />
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
  args: { model: 'owner', status: '審査待ち' },
}
