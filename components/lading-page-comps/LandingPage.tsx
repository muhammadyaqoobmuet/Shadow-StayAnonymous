'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '../ui/button'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { Inter, JetBrains_Mono } from 'next/font/google'
const inter = Inter({
	subsets: ['latin'],
	style: 'normal'
})
const LandingPage = () => {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const router = useRouter()

	async function handleJoin() {
		setLoading(true)
		setError(null)
		try {
			const getSession = await axios.get('http://localhost:3000/api/auth/session')
			const data = getSession.data

			if (data && data.name && data.token) {
				localStorage.setItem('userName', data.name) //TODO:WILL CHANGE TO ZUSTAD
				localStorage.setItem('token', data.token)
				router.push('/dashboard')
			} else {
				setError('Failed to get session data')
			}
		} catch (error: any) {
			console.error(error)
			setError(error.response?.data?.message || 'Something went wrong. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className={`min-h-[80vh] w-full flex flex-col items-center justify-center py-20 text-center ${inter.className}`}>
			<h1 className='text-5xl font-bold leading-tight line-clamp-3'>ConfessIT-chat anonymous in your neighbours</h1>
			<h2 className='text-xl text-gray-400 mt-4 max-w-2xl'>Get Acsses to closer channels and join them anonymously</h2>

			{error && (
				<div className='mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md max-w-md'>
					{error}
				</div>
			)}

			<div className='flex items-center gap-2 p-3'>
				<Button
					onClick={handleJoin}
					disabled={loading}
					className='relative'
				>
					{loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
					{loading ? 'Joining...' : 'Join Rooms Near Me'}
				</Button>
				<Button variant={'outline'} className='hover:border-gray-900 border-black'>
					How It Works
				</Button>
			</div>
		</div>
	)
}

export default LandingPage