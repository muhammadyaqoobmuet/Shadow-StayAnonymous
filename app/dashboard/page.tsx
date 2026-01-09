'use client'
import { socket } from '@/lib/socket'
import React, { useEffect, useState } from 'react'

const DashboardPage = () => {
	const [userName, setUserName] = useState<string | null>(null)

	useEffect(() => {
		setUserName(localStorage.getItem('userName'))

		// if (socket.connected) {
		// 	console.log('connected')
		// }

		// Example socket emit
		//socket.emit('join_room', { roomId: 2 })

	}, [])
	
	return (
		<div className="space-y-6">
			<div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
				<h2 className="text-3xl font-bold text-gray-900">Welcome back, {userName || 'Anonymous'}!</h2>
				<p className="text-gray-500 mt-2">You're now connected to the anonymous chat network. Start joining rooms near you.</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{[1, 2, 3].map((i) => (
					<div key={i} className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
						<div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
							<span className="text-primary font-bold">#</span>
						</div>
						<h3 className="font-semibold text-lg">Room {i}</h3>
						<p className="text-sm text-gray-400 mt-1">Active chatroom in your area</p>
					</div>
				))}
			</div>
		</div>
	)
}

export default DashboardPage