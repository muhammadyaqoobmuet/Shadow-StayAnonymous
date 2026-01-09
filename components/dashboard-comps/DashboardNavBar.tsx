'use client'
import { useEffect, useState } from 'react'
import Container from '../lading-page-comps/Container'
import { Button } from '../ui/button'
import { LogOut, LucideCurrency, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import LocationAutocomplete from '../searchLocation/LocationAutocomplete'

const DashboardNavBar = () => {
	const [userName, setUserName] = useState<string | null>(null)
	const router = useRouter()
	const [showP, setShowP] = useState(false)
	useEffect(() => {
		const storedName = localStorage.getItem('userName')
		setUserName(storedName)
	}, [])

	const handleLogout = () => {
		localStorage.removeItem('userName')
		localStorage.removeItem('token')
		router.push('/')
	}

	return (
		<nav className='border-b border-gray-100 bg-white sticky top-0 z-50'>

			<div className='flex items-center justify-between py-4'>
				<div className='flex items-center gap-2'>
					<h1 className='text-2xl font-bold tracking-tight text-primary'>ConfessIT</h1>
					<span className='bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-medium'>
						Dashboard
					</span>
				</div>

				<div className='flex items-center gap-6'>
					<div className='flex items-center gap-2 text-gray-700'>
						<div className='w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center'>
							<User size={18} />
						</div>
						<span className='font-medium'>{userName || 'Anonymous'}</span>
					</div>
					<LocationAutocomplete onSelect={(location) => { console.log(location) }} />
					<div className='relative '>
						<Button onMouseLeave={() => { setShowP(!showP) }} onMouseEnter={() => setShowP(!showP)} className='z-1 ' onClick={() => {
							navigator.geolocation.getCurrentPosition((location) => { console.log(`${location.coords.longitude},${location.coords.latitude}`) })
						}}><LucideCurrency /></Button>
						<p className={` ${showP ? 'absolute text-[12px] w-[140px] rounded-2xl text-white bg-black/80 px-2   -bottom-4 z-10' : 'hidden'}`}>Use Current Location</p>
					</div>
					<Button
						variant='ghost'
						size='sm'
					>
						Create Room
					</Button>
					<Button
						variant='ghost'
						size='sm'
						onClick={handleLogout}
						className='text-gray-500 hover:text-red-600 hover:bg-red-50'
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
