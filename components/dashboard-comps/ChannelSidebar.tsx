"use client";

import { userStore } from "@/stores/user-store";
import { Hash, ChevronDown, Plus, MessageSquare, ChevronRight, Edit3 } from "lucide-react";
import { SelectRadius } from "./SelectRadius";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Room } from "@/types";
import { useState } from "react";

export interface Channel {
	id: string;
	name: string;
	type: "public" | "private" | "broadcast";
	initials: string;
	color: string;
}

const CHANNELS: Channel[] = [
	{ id: "1", name: "general-chat", type: "public", initials: "GC", color: "" },
	{ id: "2", name: "development", type: "private", initials: "DV", color: "" },
	{ id: "3", name: "announcements", type: "broadcast", initials: "AN", color: "" },
	{ id: "4", name: "design-feedback", type: "public", initials: "DF", color: "" },
];

interface ChannelSidebarProps {
	selectedChannelId?: string;
	onSelectChannel: (channel: Channel) => void;
}

const ChannelSidebar: React.FC<ChannelSidebarProps> = ({ selectedChannelId, onSelectChannel }) => {
	const [radius, setRadius] = useState<string>("5")
	const coordinates = userStore((state) => state.coordinates)
	const [lat, lng] = coordinates || [0, 0]
	const myRooms = userStore((state) => state.myRooms)
	const { isError, data, isLoading, error } = useQuery({
		queryKey: ['allRooms', radius, lat, lng],
		queryFn: async () => {
			const res = await axios.get<{ rooms: Room[] }>(`http://localhost:3000/api/room/rooms?longitude=${lat}&latitude=${lng}&radius=${radius}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`
				}
			})
			console.log(res.data.rooms)
			return res.data.rooms
		},

		enabled: !!lat && !!lng
	})


	return (

		<div className="w-20 md:w-64 bg-black text-gray-400 flex flex-col h-full border-r border-white/5 overflow-hidden transition-all duration-300">
			{/* Workspace Header */}
			<div className="mx-auto">
				<SelectRadius onSelect={(value) => setRadius(value)} />
			</div>
			<div className="p-4 border-b border-white/5 flex items-center justify-between hover:bg-white/5 cursor-pointer group shrink-0">
				<div className="flex items-center gap-2 overflow-hidden">
					<h2 className="font-black text-white text-lg truncate hidden md:block">Chat Circle</h2>
					<ChevronDown className="w-4 h-4 text-white opacity-70 hidden md:block" />
				</div>
				<Edit3 className="w-5 h-5 text-white hidden md:block" />
			</div>

			<div className="flex-1 overflow-y-auto custom-scrollbar py-4">
				{/* Top Menu Items */}
				{/* <div className="px-2 space-y-0.5 mb-6">
					<button className="w-full flex items-center gap-3 px-3 py-1.5 rounded hover:bg-white/10 transition-colors">
						<MessageSquare className="w-4 h-4 opacity-70" />
						<span className="text-sm font-medium hidden md:block">Threads</span>
					</button>
					<button className="w-full flex items-center gap-3 px-3 py-1.5 rounded hover:bg-white/10 transition-colors">
						<Hash className="w-4 h-4 opacity-70" />
						<span className="text-sm font-medium hidden md:block">Near By Channels</span>
					</button>
				</div> */}

				{/* Nearby Channels Section */}
				<div className="space-y-1 mb-6">
					<div className="px-4 flex items-center justify-between group cursor-pointer mb-1">
						<div className="flex items-center gap-1">
							<ChevronDown className="w-3 h-3 opacity-70 hidden md:block" />
							<span className="text-xs font-bold uppercase tracking-wider hidden md:block">Nearby Channels</span>
						</div>
					</div>

					{isLoading ? (
						<div className="px-8 py-2 text-xs opacity-50 italic hidden md:block animate-pulse">
							Searching for rooms...
						</div>
					) : data && data.length > 0 ? (
						data.map((room) => (
							<button
								key={room._id}
								onClick={() => onSelectChannel({
									id: room._id,
									name: room.name,
									type: "public",
									initials: room.name[0].toUpperCase(),
									color: ""
								})}
								className={`w-full flex items-center gap-2 px-4 py-1.5 transition-colors ${selectedChannelId === room._id
									? "bg-[#1164A3] text-white"
									: "hover:bg-white/10"
									}`}
							>
								<div className="flex items-center justify-between w-full">
									<div className="flex items-center gap-2">
										<Hash className={`w-4 h-4 shrink-0 ${selectedChannelId === room._id ? "text-white" : "opacity-70"}`} />
										<span className={`text-sm truncate hidden md:block ${selectedChannelId === room._id ? "font-bold text-white" : ""}`}>
											{room.name}
										</span>
									</div>
									<span className="text-[10px] text-green-00 opacity-90 group-hover:opacity-70 hidden md:block">
										{room.distanceInKm.toFixed(1)}km
									</span>
								</div>
							</button>
						))
					) : (
						<div className="px-8 py-2 text-xs opacity-50 italic hidden md:block">
							No rooms found nearby
						</div>
					)}
				</div>

				{/* Channels Section */}
				<div className="space-y-1 mb-6">
					<div className="px-4 flex items-center justify-between group cursor-pointer mb-1">
						<div className="flex items-center gap-1">
							<ChevronDown className="w-3 h-3 opacity-70 hidden md:block" />
							<span className="text-xs font-bold uppercase tracking-wider hidden md:block">Channels</span>
						</div>
						<Plus className="w-4 h-4 opacity-0 group-hover:opacity-70 transition-opacity hidden md:block" />
					</div>

					{CHANNELS.map((channel) => (
						<button
							key={channel.id}
							onClick={() => onSelectChannel(channel)}
							className={`w-full flex items-center gap-2 px-4 py-1.5 transition-colors ${selectedChannelId === channel.id
								? "bg-[#1164A3] text-white"
								: "hover:bg-white/10"
								}`}
						>
							<Hash className={`w-4 h-4 shrink-0 ${selectedChannelId === channel.id ? "text-white" : "opacity-70"}`} />
							<span className={`text-sm truncate hidden md:block ${selectedChannelId === channel.id ? "font-bold text-white" : ""}`}>
								{channel.name}
							</span>
						</button>
					))}
				</div>

				{/* User Rooms Section */}
				<div className="space-y-1">
					<div className="px-4 flex items-center justify-between group cursor-pointer mb-1">
						<div className="flex items-center gap-1">
							<ChevronDown className="w-3 h-3 opacity-70 hidden md:block" />
							<span className="text-xs font-bold uppercase tracking-wider hidden md:block">My Channels</span>
						</div>
						<Plus className="w-4 h-4 opacity-0 group-hover:opacity-70 transition-opacity hidden md:block" />
					</div>

					{myRooms.length > 0 ? (
						myRooms.map((roomData) => (
							<button
								key={roomData.room._id}
								onClick={() => onSelectChannel({
									id: roomData.room._id,
									name: roomData.room.name,
									type: "public",
									initials: roomData.room.name[0].toUpperCase(),
									color: ""
								})}
								className={`w-full flex items-center gap-2 px-4 py-1.5 transition-colors ${selectedChannelId === roomData.room._id
									? "bg-[#1164A3] text-white"
									: "hover:bg-white/10"
									}`}
							>
								<Hash className={`w-4 h-4 shrink-0 ${selectedChannelId === roomData.room._id ? "text-white" : "opacity-70"}`} />
								<span className={`text-sm truncate hidden md:block ${selectedChannelId === roomData.room._id ? "font-bold text-white" : ""}`}>
									{roomData.room.name}
								</span>
							</button>
						))
					) : (
						<div className="px-8 py-2 text-xs opacity-50 italic hidden md:block">
							No rooms created yet
						</div>
					)}
				</div>
			</div>


			<style jsx global>{`
				.custom-scrollbar::-webkit-scrollbar {
					width: 8px;
				}
				.custom-scrollbar::-webkit-scrollbar-track {
					background: transparent;
				}
				.custom-scrollbar::-webkit-scrollbar-thumb {
					background: rgba(255, 255, 255, 0.1);
					border-radius: 4px;
				}
				.custom-scrollbar::-webkit-scrollbar-thumb:hover {
					background: rgba(255, 255, 255, 0.2);
				}
			`}</style>
		</div>
	);
};

export default ChannelSidebar;

