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
      { id: '1', sender: '利用者', content: 'プロジェクター設備はありますか？', timestamp: '2026-03-30 10:00', isOwn: true },
      { id: '2', sender: 'オーナー', content: 'はい、HDMIプロジェクターを常設しております。', timestamp: '2026-03-30 10:15', isOwn: false },
      { id: '3', sender: '利用者', content: '承知しました。ありがとうございます。', timestamp: '2026-03-30 10:20', isOwn: true },
    ],
  },
}

export const Empty: Story = {
  args: { messages: [] },
}
