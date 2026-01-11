'use client'
import React, { useState } from 'react'
import { userStore } from '@/stores/user-store'
import ChannelSidebar, { Channel } from '@/components/dashboard-comps/ChannelSidebar'
import ChannelView from '@/components/dashboard-comps/ChannelView'

const DashboardPage = () => {

	const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)

	return (
		<div className="h-[calc(100vh-64px)] overflow-hidden flex bg-black">
			<ChannelSidebar
				selectedChannelId={selectedChannel?.id}
				onSelectChannel={setSelectedChannel}
			/>

			<ChannelView channel={selectedChannel} />
		</div>
	)
}

export default DashboardPage