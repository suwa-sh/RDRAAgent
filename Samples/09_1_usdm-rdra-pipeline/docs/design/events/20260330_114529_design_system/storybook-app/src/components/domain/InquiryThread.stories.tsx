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
    subject: '会議室Aの設備について',
    messages: [
      { id: '1', sender: '利用者 田中', content: 'プロジェクターのHDMI接続は可能でしょうか？VGAのみでしょうか？', timestamp: '2026-03-28 10:30' },
      { id: '2', sender: 'オーナー 佐藤', content: 'HDMI、VGA両方に対応しています。USB-Cアダプターも備え付けがあります。', timestamp: '2026-03-28 11:15', isReply: true },
      { id: '3', sender: '利用者 田中', content: 'ありがとうございます。当日よろしくお願いいたします。', timestamp: '2026-03-28 11:20' },
    ],
  },
}
