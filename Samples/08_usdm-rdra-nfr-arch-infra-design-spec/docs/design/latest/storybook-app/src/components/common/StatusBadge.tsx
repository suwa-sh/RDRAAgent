import React from 'react'
import { Badge, type BadgeVariant } from '@/components/ui/Badge'

export type StatusBadgeModel = 'owner' | 'room' | 'reservation' | 'inquiry' | 'settlement' | 'payment' | 'key'
export type StatusBadgeSize = 'sm' | 'md'

export interface StatusBadgeProps {
  status: string
  model: StatusBadgeModel
  size?: StatusBadgeSize
}

type StatusConfig = {
  label: string
  variant: BadgeVariant
}

const statusMap: Record<StatusBadgeModel, Record<string, StatusConfig>> = {
  owner: {
    '審査待ち':  { label: '審査待ち',  variant: 'warning' },
    '登録済み':  { label: '登録済み',  variant: 'success' },
    '却下':      { label: '却下',      variant: 'destructive' },
    '退会':      { label: '退会',      variant: 'default' },
  },
  room: {
    '非公開':    { label: '非公開',    variant: 'default' },
    '公開可能':  { label: '公開可能',  variant: 'info' },
    '公開中':    { label: '公開中',    variant: 'success' },
  },
  reservation: {
    '申請':      { label: '申請',      variant: 'warning' },
    '確定':      { label: '確定',      variant: 'success' },
    '変更':      { label: '変更',      variant: 'info' },
    '取消':      { label: '取消',      variant: 'destructive' },
  },
  inquiry: {
    '未対応':    { label: '未対応',    variant: 'warning' },
    '回答済み':  { label: '回答済み',  variant: 'info' },
    '対応済み':  { label: '対応済み',  variant: 'success' },
  },
  settlement: {
    '未精算':        { label: '未精算',        variant: 'default' },
    '精算計算済み':  { label: '精算計算済み',  variant: 'info' },
    '支払済み':      { label: '支払済み',      variant: 'success' },
  },
  payment: {
    '未登録':          { label: '未登録',          variant: 'default' },
    '決済手段登録済み': { label: '決済手段登録済み', variant: 'info' },
    '引き落とし済み':  { label: '引き落とし済み',  variant: 'success' },
  },
  key: {
    '保管中':    { label: '保管中',    variant: 'default' },
    '貸出中':    { label: '貸出中',    variant: 'info' },
  },
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, model, size = 'md' }) => {
  const config = statusMap[model]?.[status]
  if (!config) {
    return (
      <Badge variant="default">
        <span style={{ fontSize: size === 'sm' ? 'var(--text-xs)' : undefined }}>{status}</span>
      </Badge>
    )
  }

  return (
    <Badge variant={config.variant}>
      <span style={{ fontSize: size === 'sm' ? 'var(--text-xs)' : undefined }}>{config.label}</span>
    </Badge>
  )
}
