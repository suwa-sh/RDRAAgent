import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ErrorBanner } from '@/components/common/ErrorBanner'

const meta = {
  title: 'Common/ErrorBanner',
  component: ErrorBanner,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'radio', options: ['error', 'warning', 'info'] },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 600 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ErrorBanner>

export default meta
type Story = StoryObj<typeof meta>

export const Error403: Story = {
  name: 'Error (403)',
  args: {
    variant: 'error',
    title: 'アクセスが拒否されました',
    description: 'このページを表示する権限がありません。管理者にお問い合わせください。(403 Forbidden)',
    onDismiss: () => {},
  },
}

export const Warning409: Story = {
  name: 'Warning (409)',
  args: {
    variant: 'warning',
    title: '予約が重複しています',
    description: '選択した時間帯にはすでに別の予約が入っています。日時を変更してお試しください。(409 Conflict)',
    onDismiss: () => {},
  },
}

export const Info: Story = {
  args: {
    variant: 'info',
    title: 'メンテナンスのお知らせ',
    description: '2026年4月1日 02:00〜04:00 はシステムメンテナンスのためサービスを一時停止します。',
    onDismiss: () => {},
  },
}

export const WithAction: Story = {
  args: {
    variant: 'error',
    title: '決済に失敗しました',
    description: 'カード情報を確認のうえ、再度お試しください。',
    action: {
      label: '決済情報を更新',
      onClick: () => {},
    },
    onDismiss: () => {},
  },
}

export const NoDescription: Story = {
  args: {
    variant: 'warning',
    title: 'セッションが期限切れです。再ログインしてください。',
    onDismiss: () => {},
  },
}
