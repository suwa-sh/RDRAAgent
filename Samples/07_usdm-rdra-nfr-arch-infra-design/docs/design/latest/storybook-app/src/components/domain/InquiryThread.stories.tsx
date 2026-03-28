import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { InquiryThread, type Message } from './InquiryThread'

const sampleMessages: Message[] = [
  {
    id: '1',
    sender: '田中太郎',
    senderRole: 'user',
    content: '大会議室Aの予約について質問があります。プロジェクターは備え付けでしょうか？',
    timestamp: '2026年3月28日 10:00',
  },
  {
    id: '2',
    sender: '佐藤花子',
    senderRole: 'owner',
    content: 'お問い合わせありがとうございます。はい、プロジェクターは常設しております。HDMI接続に対応しています。',
    timestamp: '2026年3月28日 10:15',
  },
  {
    id: '3',
    sender: '田中太郎',
    senderRole: 'user',
    content: 'ありがとうございます。それでは、4月5日の13:00〜17:00で予約をお願いしたいのですが、可能でしょうか？',
    timestamp: '2026年3月28日 10:20',
  },
  {
    id: '4',
    sender: '佐藤花子',
    senderRole: 'owner',
    content: 'はい、その日時は空いております。予約ページから手続きをお願いいたします。',
    timestamp: '2026年3月28日 10:30',
  },
  {
    id: '5',
    sender: '運営サポート',
    senderRole: 'admin',
    content: 'ご利用ありがとうございます。ご不明な点がございましたら、お気軽にお問い合わせください。',
    timestamp: '2026年3月28日 11:00',
  },
]

const meta: Meta<typeof InquiryThread> = {
  title: 'Domain/InquiryThread',
  component: InquiryThread,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 600 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof InquiryThread>

export const WithMessages: Story = {
  args: {
    messages: sampleMessages,
  },
}

export const WithSendInput: Story = {
  args: {
    messages: sampleMessages,
    onSend: (message: string) => {
      console.log('送信:', message)
    },
  },
}
