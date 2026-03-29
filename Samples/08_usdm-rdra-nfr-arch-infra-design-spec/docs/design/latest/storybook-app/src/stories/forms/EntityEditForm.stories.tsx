import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React from 'react'
import { EntityEditForm } from '@/components/common/EntityEditForm'
import type { EntityEditField } from '@/components/common/EntityEditForm'

// ---- モックデータ ----

const ownerFields: EntityEditField[] = [
  { name: 'fullName', label: '氏名', type: 'text', value: '山田 花子', required: true },
  { name: 'phone', label: '連絡先電話番号', type: 'tel', value: '090-1234-5678', required: true },
  { name: 'email', label: 'メールアドレス', type: 'email', value: 'hanako.yamada@example.com', required: true },
]

const roomFields: EntityEditField[] = [
  { name: 'roomName', label: '会議室名', type: 'text', value: '大会議室A（渋谷本社）', required: true },
  { name: 'location', label: '所在地', type: 'text', value: '東京都渋谷区桜丘町1-2 3F', required: true },
  { name: 'area', label: '広さ（m²）', type: 'number', value: '45' },
  { name: 'capacity', label: '収容人数', type: 'number', value: '20', required: true },
  { name: 'pricePerHour', label: '1時間あたり価格（円）', type: 'number', value: '5000', required: true },
]

// ---- Meta ----

const meta: Meta<typeof EntityEditForm> = {
  title: 'Common/EntityEditForm',
  component: EntityEditForm,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    onSave: { action: '保存' },
    onCancel: { action: 'キャンセル' },
  },
}

export default meta
type Story = StoryObj<typeof EntityEditForm>

// ---- Stories ----

export const Default: Story = {
  name: 'Default — オーナー情報編集',
  args: {
    title: 'オーナー情報を変更する',
    fields: ownerFields,
    isLoading: false,
    saveSuccess: false,
  },
}

export const RoomEdit: Story = {
  name: 'RoomEdit — 会議室情報編集',
  args: {
    title: '会議室情報を変更する',
    fields: roomFields,
    isLoading: false,
    saveSuccess: false,
  },
}

export const Loading: Story = {
  name: 'Loading — 保存中',
  args: {
    title: 'オーナー情報を変更する',
    fields: ownerFields,
    isLoading: true,
    saveSuccess: false,
  },
}

export const SaveSuccess: Story = {
  name: 'SaveSuccess — 保存成功',
  args: {
    title: 'オーナー情報を変更する',
    fields: ownerFields,
    isLoading: false,
    saveSuccess: true,
  },
}
