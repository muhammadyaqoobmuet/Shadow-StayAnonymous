'use client'
import { useEffect, useState } from 'react'
import Container from '../lading-page-comps/Container'
import { Button } from '../ui/button'
import { LogOut, LucideCurrency, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import LocationAutocomplete from '../searchLocation/LocationAutocomplete'
import { CreateRoom } from './Create-Room'
import { userStore } from '@/stores/user-store'
import { toast } from 'sonner'
import { SelectRadius } from './SelectRadius'

const DashboardNavBar = () => {
	const setCords = userStore((state) => state.setCoordinates)
	const router = useRouter()
	const userName = userStore((state) => state.name)
	const cleanShit = userStore((state) => state.clearUser)
	const [showP, setShowP] = useState(false)


	const handleLogout = () => {
		cleanShit()
		localStorage.removeItem('token')
		router.push('/')
	}

	return (
		<nav className='border-b border-white/5 bg-black sticky top-0 z-50 px-6'>
			<div className='flex items-center justify-between py-3'>
				<div className='flex items-center gap-3'>
					<h1 className='text-2xl font-black tracking-tighter text-white'>ConfessIT</h1>
					<span className='bg-white/10 text-gray-400 text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-widest border border-white/5'>
						Premium Dashboard
					</span>
				</div>

				<div className='flex items-center gap-6'>
					<div className='flex items-center gap-3 text-gray-300'>
						<div className='w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/10'>
							<User size={16} className="text-white" />
						</div>
						<span className='font-bold text-sm'>{userName || 'Anonymous'}</span>
					</div>
					<LocationAutocomplete onSelect={(location) => {
						setCords([location.lat, location.lng])
						toast.success('location set')
					}} />
					<div className='relative '>
						<Button onMouseLeave={() => { setShowP(!showP) }} onMouseEnter={() => setShowP(!showP)} className='z-1 bg-white/10 hover:bg-white/20 text-white border-white/10' onClick={() => {
							navigator.geolocation.getCurrentPosition((location) => {
								setCords([location.coords.latitude, location.coords.longitude])
								toast.success('current location added')
							})
						}}><LucideCurrency /></Button>
						<p className={` ${showP ? 'absolute text-[12px] w-[140px] rounded-2xl text-white bg-black/90 border border-white/10 px-2   -bottom-4 z-10' : 'hidden'}`}>Use Current Location</p>
					</div>

					<CreateRoom />

					<Button
						variant='ghost'
						size='sm'
						onClick={handleLogout}
						className='text-gray-500 hover:text-white hover:bg-red-600/20'
					>
						<LogOut size={18} className='mr-2' />
						Logout
					</Button>
				</div>
			</div>
		</nav>
	)
}

export default DashboardNavBar
