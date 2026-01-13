"use client";

import { userStore } from "@/stores/user-store";
import { Hash, Search, ChevronDown, Plus, Dot, Radio, MapPin, Signal, User, Sun, Moon } from "lucide-react";
import { SelectRadius } from "./SelectRadius";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Room } from "@/types";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
import { getSocketConnetion } from "@/lib/socket";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

export interface Channel {
	id: string;
	name: string;
	type: "public" | "private" | "broadcast";
	initials: string;
	color: string;
	joined?: boolean;
	totalMembers?: number;
	totalOnline?: number;
}

interface ChannelSidebarProps {
	selectedChannelId?: string;
	onSelectChannel: (channel: Channel) => void;
}

const ChannelSidebar: React.FC<ChannelSidebarProps> = ({ selectedChannelId, onSelectChannel }) => {
	const [radius, setRadius] = useState<string>("5")
	const [searchQuery, setSearchQuery] = useState("")
	const router = useRouter()
	const coordinates = userStore((state) => state.coordinates)
	const [lng, lat] = coordinates || [0, 0]
	const myRooms = userStore((state) => state.myRooms)
	const [token, setToken] = useState<string | null>(null)
	const { theme, setTheme } = useTheme()
	const [mounted, setMounted] = useState(false)

	const isSidebarOpen = userStore((state) => state.isSidebarOpen)
	const setSidebarOpen = userStore((state) => state.setSidebarOpen)

	useEffect(() => {
		setToken(localStorage.getItem('token'))
		setMounted(true)
	}, [])

	const handleChannelSelect = (channel: Channel) => {
		onSelectChannel(channel);
		if (window.innerWidth < 768) {
			setSidebarOpen(false);
		}
	}

	const { isError, data, isLoading } = useQuery({
		queryKey: ['allRooms', radius, lat, lng],
		queryFn: async () => {
			try {
				const res = await axios.get<{ rooms: Room[] }>(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/room/rooms?longitude=${lat}&latitude=${lng}&radius=${radius}`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`
					}
				})
				return res.data.rooms
			} catch (error: any) {
				if (error?.response?.status === 401) {
					localStorage.removeItem("token")
					router.push('/')
				}
				throw error
			}
		},
		enabled: !!lat && !!lng
	})

	useEffect(() => {
		const token = localStorage.getItem('token')
		if (!token) return
		const socket = getSocketConnetion(token)

		socket.emit("join_room", 100, (response: any) => {
			if (response.success) {
				console.log("Joined heartbeat room")
			}
		})

		return () => {
			socket.disconnect()
		}
	}, [])

	const filteredRooms = data?.filter(room =>
		room.name.toLowerCase().includes(searchQuery.toLowerCase())
	) || []

	return (
		<AnimatePresence mode="wait">
			{(isSidebarOpen || (mounted && window.innerWidth >= 768)) && (
				<>
					{/* Backdrop for mobile */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.25, ease: "easeInOut" }}
						onClick={() => setSidebarOpen(false)}
						className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
					/>

					<motion.aside
						initial={mounted && window.innerWidth < 768 ? { x: -300 } : undefined}
						animate={{ x: 0 }}
						exit={mounted && window.innerWidth < 768 ? { x: -300 } : undefined}
						transition={{ duration: 0.25, ease: "easeInOut" }}
						className={`fixed md:relative top-0 left-0 h-full w-72 md:w-72 border-r border-border bg-background flex flex-col overflow-hidden z-50 md:z-10`}
					>
						{/* SEARCH SECTION */}
						<div className="p-3 border-b border-border/50">
							<div className="relative group">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-white transition-colors" size={14} />
								<input
									type="text"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									placeholder="Scan frequencies..."
									className="w-full bg-surface border border-border py-2 pl-9 pr-4 text-xs text-foreground placeholder:text-zinc-500 focus:outline-none focus:border-border/50 transition-colors font-mono"
								/>
							</div>
						</div>

						{/* RADIUS SELECTOR - Integrated into Sidebar Header */}
						<div className="px-4 py-2 flex items-center justify-between border-b border-border/30 bg-surface/30">
							<div className="flex items-center gap-2 text-[10px] font-mono text-secondary uppercase tracking-widest">
								<Signal size={12} className="text-zinc-500" />
								Range
							</div>
							<SelectRadius onSelect={(value) => setRadius(value)} />
						</div>

						<div className="flex-1 overflow-y-auto custom-scrollbar">
							{/* NEARBY CHANNELS SECTION */}
							<div className="py-2">
								<div className="px-4 py-3 flex items-center justify-between group">
									<h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] font-mono">Detected Signals</h2>
									<span className="text-[10px] font-mono text-zinc-500 bg-white/5 px-2 py-0.5 border border-white/5">
										{filteredRooms.length} <span className="opacity-50">ACTIVE</span>
									</span>
								</div>

								<div className="space-y-0.5 px-2">
									{isLoading ? (
										<div className="px-4 py-3 text-[10px] font-mono text-zinc-500 animate-pulse italic">
											{" > "} SCANNING SECTORS...
										</div>
									) : filteredRooms.length > 0 ? (
										filteredRooms.map((room) => (
											<button
												key={room._id}
												onClick={() => handleChannelSelect({
													id: room._id,
													name: room.name,
													type: "public",
													initials: room.name[0].toUpperCase(),
													color: "",
													joined: room.joined,
													totalMembers: room.totalMembers,
													totalOnline: room.totalOnline
												})}
												className={`w-full flex items-center gap-3 px-3 py-3 rounded-none transition-all duration-200 text-left group relative overflow-hidden ${selectedChannelId === room._id
													? "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
													: "text-muted-foreground hover:bg-surface hover:text-foreground border border-transparent hover:border-border"
													}`}
											>
												<div className={`flex items-center justify-center ${selectedChannelId === room._id ? "text-black" : "text-zinc-600 group-hover:text-white"}`}>
													<Hash size={15} />
												</div>
												<div className="flex-1 min-w-0">
													<div className="flex justify-between items-baseline">
														<span className={`text-[13px] tracking-tight truncate uppercase font-bold ${selectedChannelId === room._id ? "text-primary-foreground" : "text-foreground"}`}>
															{room.name}
														</span>
														{selectedChannelId === room._id && (
															<span className="flex items-center gap-1.5">
																<span className="text-[9px] font-mono text-primary-foreground font-black uppercase">LIVE</span>
																<span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse shadow-[0_0_8px_var(--accent)]" />
															</span>
														)}
													</div>
													<div className="flex items-center gap-2 mt-2">
														<span className={`text-xs font-mono font-semibold ${selectedChannelId === room._id ? 'text-primary-foreground/90' : 'text-foreground/80 group-hover:text-foreground'} flex items-center gap-3`}>
															<span className="flex items-center gap-1.5" title="Online Peers"><Radio size={13} className="text-accent" /> {room.totalOnline || 0}</span>
															<span className="opacity-30">•</span>
															<span className="flex items-center gap-1.5" title="Total Members"><User size={13} /> {room.totalMembers || 0}</span>
															<span className="opacity-30">•</span>
															<span className="flex items-center gap-1.5"><MapPin size={13} className="text-muted-foreground" /> {room.distanceInKm.toFixed(1)}km</span>
														</span>
													</div>
												</div>
											</button>
										))
									) : (
										<div className="px-4 py-3 text-[10px] font-mono text-zinc-700 italic">
											{" > "} NO SIGNALS DETECTED
										</div>
									)}
								</div>
							</div>

							{/* USER ROOMS SECTION */}
							<div className="py-2 border-t border-border/30 mt-2">
								<div className="px-4 py-3 flex items-center justify-between group">
									<h2 className="text-[10px] font-bold text-secondary uppercase tracking-widest font-mono">My Broadcasters</h2>
									<Plus className="w-3 h-3 text-zinc-600 hover:text-white cursor-pointer transition-colors" />
								</div>

								<div className="space-y-0.5 px-2">
									{myRooms.length > 0 ? (
										myRooms.map((roomData) => (
											<button
												key={roomData.room._id}
												onClick={() => handleChannelSelect({
													id: roomData.room._id,
													name: roomData.room.name,
													type: "public",
													initials: roomData.room.name[0].toUpperCase(),
													color: "",
													joined: true
												})}
												className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-none transition-all duration-200 text-left group overflow-hidden ${selectedChannelId === roomData.room._id
													? "bg-primary text-primary-foreground"
													: "text-muted-foreground hover:bg-surface hover:text-foreground border border-transparent hover:border-border"
													}`}
											>
												<div className={`flex items-center justify-center ${selectedChannelId === roomData.room._id ? "text-primary-foreground" : "text-zinc-500 group-hover:text-foreground"}`}>
													<Signal size={14} />
												</div>
												<span className={`text-sm truncate ${selectedChannelId === roomData.room._id ? "font-bold" : "font-medium"}`}>
													{roomData.room.name}
												</span>
											</button>
										))
									) : (
										<div className="px-4 py-3 text-[10px] font-mono text-zinc-700 italic">
											{" > "} NO OWNED SIGNALS
										</div>
									)}
								</div>
							</div>
						</div>

						{/* STATUS BAR */}
						<div className="p-3 border-t border-border bg-surface shadow-[0_-1px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_-1px_10px_rgba(0,0,0,0.8)]">
							<div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
								<span className="flex items-center gap-2 truncate pr-2 font-medium">
									<Dot className="text-border" /> <span className="opacity-50">ID:</span> {token ? token.substring(0, 12) : 'STANDBY'}...
								</span>
								<div className="flex items-center gap-2">
									{mounted && (
										<button
											onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
											className="p-2 hover:bg-primary/10 transition-colors border border-border/50 hover:border-border rounded-none bg-background/50"
											title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
										>
											{theme === "dark" ? <Sun size={14} className="text-yellow-500" /> : <Moon size={14} className="text-indigo-950" />}
										</button>
									)}
									<span className="text-[9px] text-accent font-black tracking-widest animate-pulse">ONLINE</span>
									<span className="w-2 h-2 bg-accent rounded-full animate-pulse shadow-[0_0_8px_var(--accent)] shrink-0" />
								</div>
							</div>
						</div>
					</motion.aside>
				</>
			)}
		</AnimatePresence>
	);
};

export default ChannelSidebar;

