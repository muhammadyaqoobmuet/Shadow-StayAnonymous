'use client'
import { useState, useEffect } from 'react'
import { Ghost, MapPin, ChevronDown, Plus, LogOut, Crosshair, User, Loader2, Menu } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { userStore } from '@/stores/user-store'
import { toast } from 'sonner'
import { CreateRoom } from './Create-Room'
import LocationAutocomplete from '../searchLocation/LocationAutocomplete'

const DashboardNavBar = () => {
	const setCords = userStore((state) => state.setCoordinates)
	const toggleSidebar = userStore((state) => state.toggleSidebar)
	const router = useRouter()
	const userName = userStore((state) => state.name)
	const clearUser = userStore((state) => state.clearUser)

	const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false)
	const [currentLocation, setCurrentLocation] = useState('Detecting...')
	const [isGPSLoading, setIsGPSLoading] = useState(false)

	const handleLogout = () => {
		clearUser()
		localStorage.removeItem('token')
		router.push('/')
	}

	const useCurrentLocation = () => {
		setIsGPSLoading(true)
		navigator.geolocation.getCurrentPosition((location) => {
			setCords([location.coords.latitude, location.coords.longitude])
			setCurrentLocation(`${location.coords.latitude.toFixed(2)}, ${location.coords.longitude.toFixed(2)}`)
			toast.success('Location synchronized via GPS')
			setIsLocationMenuOpen(false)
			setIsGPSLoading(false)
		}, () => {
			toast.error('Failed to access geolocation services')
			setIsGPSLoading(false)
		})
	}

	const handleLocationSelect = (loc: { lat: number, lng: number, name: string }) => {
		setCords([loc.lat, loc.lng]);
		setCurrentLocation(loc.name);
		toast.success(`Frequency locked: ${loc.name}`);
		setIsLocationMenuOpen(false);
	}

	return (
		<header className="h-16 border-b border-border bg-background flex items-center justify-between px-4 md:px-6 z-50 sticky top-0 shadow-[0_1px_10px_rgba(0,0,0,0.05)] dark:shadow-none">
			<div className="flex items-center gap-3 md:gap-8">
				{/* MOBILE SIDEBAR TOGGLE */}
				<button
					onClick={toggleSidebar}
					className="md:hidden p-2 text-foreground hover:bg-surface transition-colors"
				>
					<Menu size={20} />
				</button>

				<div className="flex items-center gap-1">
					<div className="bg-primary text-primary-foreground p-1 px-1.5 font-black text-xs">
						<Ghost size={14} strokeWidth={3} />
					</div>
					<span className="text-foreground text-lg md:text-xl font-black tracking-tighter italic hidden sm:inline">SHADOW</span>
				</div>

				<div className="h-8 w-px bg-border hidden sm:block" />

				{/* LOCATION CONTROLLER */}
				<div className="relative h-full flex items-center">
					<button
						onClick={() => setIsLocationMenuOpen(!isLocationMenuOpen)}
						className="flex items-center gap-2 px-2 md:px-4 py-1.5 bg-surface border border-border text-foreground hover:bg-primary/5 transition-all group"
					>
						<MapPin size={12} className="text-accent" />
						<span className="text-[10px] md:text-[11px] font-mono uppercase tracking-widest font-bold max-w-[80px] md:max-w-[120px] truncate">
							{currentLocation}
						</span>
						<ChevronDown size={12} className={`text-muted-foreground group-hover:text-foreground transition-transform ${isLocationMenuOpen ? 'rotate-180' : ''}`} />
					</button>

					<AnimatePresence>
						{isLocationMenuOpen && (
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 10 }}
								className="fixed md:absolute top-16 md:top-full left-4 md:left-0 right-4 md:right-auto mt-2 p-4 bg-background border border-border shadow-2xl z-50 min-w-[280px] md:min-w-[300px]"
							>
								<div className="space-y-4">
									<LocationAutocomplete onSelectAction={handleLocationSelect} />
									<button
										onClick={useCurrentLocation}
										disabled={isGPSLoading}
										className="w-full flex items-center justify-center gap-2 py-3 bg-surface border border-border text-foreground hover:bg-primary/5 text-[10px] font-mono uppercase tracking-widest transition-all disabled:opacity-50"
									>
										{isGPSLoading ? (
											<Loader2 size={14} className="animate-spin" />
										) : (
											<Crosshair size={14} />
										)}
										{isGPSLoading ? 'SYNCING GPS...' : 'Sync GPS Coordinates'}
									</button>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>

			<div className="flex items-center gap-2 md:gap-4">
				<CreateRoom />

				<div className="h-8 w-px bg-border mx-1 md:mx-2" />

				<button
					onClick={() => {
						localStorage.removeItem('token')
						router.push('/')
					}}
					className="flex items-center gap-2 text-muted-foreground hover:text-destructive transition-colors group"
					title="Terminate Session"
				>
					<div className="hidden md:flex flex-col items-end">
						<span className="text-[10px] font-mono font-bold uppercase tracking-tighter leading-none">Terminate</span>
						<span className="text-[8px] font-mono opacity-50 uppercase tracking-tighter">Session</span>
					</div>
					<div className="p-2 border border-border group-hover:border-destructive/50 group-hover:bg-destructive/5 transition-all">
						<LogOut size={16} />
					</div>
				</button>
			</div>
		</header>
	)
}

export default DashboardNavBar
