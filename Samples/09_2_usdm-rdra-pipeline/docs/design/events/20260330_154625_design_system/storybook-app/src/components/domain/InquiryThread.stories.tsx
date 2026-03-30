import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { InquiryThread } from './InquiryThread'

const meta: Meta<typeof InquiryThread> = {
  title: 'Domain/InquiryThread',
  component: InquiryThread,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof InquiryThread>

export const Default: Story = {
  args: {
    messages: [
      {
        id: '1',
        sender: '田中太郎',
        content: '4月1日の予約について、プロジェクター利用は可能でしょうか？',
        timestamp: '2026/03/28 10:30',
        isOwn: false,
      },
      {
        id: '2',
        sender: 'オーナー 鈴木',
        content: 'はい、プロジェクターは会議室に常設しております。HDMIケーブルもご用意しています。',
        timestamp: '2026/03/28 11:15',
        isOwn: true,
      },
      {
        id: '3',
        sender: '田中太郎',
        content: 'ありがとうございます。当日よろしくお願いいたします。',
        timestamp: '2026/03/28 11:30',
        isOwn: false,
      },
    ],
  },
}
