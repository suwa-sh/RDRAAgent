import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { PortalShell } from '../../../components/layout/PortalShell'
import { SearchFilter } from '../../../components/domain/SearchFilter'
import { RoomCard } from '../../../components/domain/RoomCard'

const meta: Meta = { title: 'Pages/利用者ポータル/会議室検索' }
export default meta

export const Default: StoryObj = {
  render: () => (
    <PortalShell portal="user" activeNav="Rooms">
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Room Search</h1>
      <SearchFilter onFilter={() => {}} />
      <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', marginTop: '24px' }}>
        <RoomCard name="Sakura Room" area="30" price={3000} rating={4.5} imageUrl="" location="Shibuya" available={true} />
        <RoomCard name="Fuji Room" area="50" price={5000} rating={4.2} imageUrl="" location="Shinjuku" available={true} />
        <RoomCard name="Zen Room" area="20" price={2000} rating={4.8} imageUrl="" location="Ginza" available={false} />
      </div>
    </PortalShell>
  ),
}
