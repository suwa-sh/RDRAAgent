import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { SearchFilterPanel } from '@/components/common/SearchFilterPanel'
import type { FilterField } from '@/components/common/SearchFilterPanel'

// ---- モックデータ ----

const roomSearchFields: FilterField[] = [
  {
    name: 'area',
    label: 'エリア',
    type: 'select',
    placeholder: 'エリアを選択',
    options: [
      { value: 'shibuya', label: '渋谷区' },
      { value: 'shinjuku', label: '新宿区' },
      { value: 'minato', label: '港区' },
      { value: 'chiyoda', label: '千代田区' },
      { value: 'chuo', label: '中央区' },
    ],
  },
  {
    name: 'capacity',
    label: '収容人数（名以上）',
    type: 'number',
    placeholder: '例: 10',
  },
  {
    name: 'maxPrice',
    label: '価格上限（円/時間）',
    type: 'number',
    placeholder: '例: 10000',
  },
  {
    name: 'roomType',
    label: '会議室種別',
    type: 'select',
    placeholder: '種別を選択',
    options: [
      { value: 'physical', label: '物理会議室' },
      { value: 'virtual', label: 'バーチャル会議室' },
    ],
  },
]

const ownerReviewFields: FilterField[] = [
  {
    name: 'appliedFrom',
    label: '申請日（From）',
    type: 'date',
  },
  {
    name: 'appliedTo',
    label: '申請日（To）',
    type: 'date',
  },
  {
    name: 'reviewStatus',
    label: '審査状態',
    type: 'select',
    placeholder: '状態を選択',
    options: [
      { value: 'pending', label: '審査待ち' },
      { value: 'approved', label: '承認済み' },
      { value: 'rejected', label: '否認' },
    ],
  },
]

const usageHistoryFields: FilterField[] = [
  {
    name: 'periodFrom',
    label: '期間（From）',
    type: 'date',
  },
  {
    name: 'periodTo',
    label: '期間（To）',
    type: 'date',
  },
  {
    name: 'userId',
    label: '利用者名',
    type: 'text',
    placeholder: '例: 田中太郎',
  },
  {
    name: 'roomName',
    label: '会議室名',
    type: 'text',
    placeholder: '例: 大会議室A',
  },
]

// ---- Meta ----

const meta: Meta<typeof SearchFilterPanel> = {
  title: 'Common/SearchFilterPanel',
  component: SearchFilterPanel,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    onSearch: { action: '検索' },
    onClear: { action: 'クリア' },
  },
}

export default meta
type Story = StoryObj<typeof SearchFilterPanel>

// ---- Stories ----

export const RoomSearch: Story = {
  name: 'RoomSearch — 会議室検索',
  args: {
    fields: roomSearchFields,
    isLoading: false,
  },
}

export const OwnerReview: Story = {
  name: 'OwnerReview — オーナー審査',
  args: {
    fields: ownerReviewFields,
    isLoading: false,
  },
}

export const UsageHistory: Story = {
  name: 'UsageHistory — 利用履歴',
  args: {
    fields: usageHistoryFields,
    isLoading: false,
  },
}

export const LoadingState: Story = {
  name: 'Loading — 検索中',
  args: {
    fields: roomSearchFields,
    isLoading: true,
  },
}
