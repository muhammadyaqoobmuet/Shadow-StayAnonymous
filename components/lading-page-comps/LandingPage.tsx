import Link from 'next/link'
import { Button } from '../ui/button'

const LandingPage = () => {
	return (
		<div className='min-h-[80vh] w-full flex flex-col items-center justify-center py-20 text-center'>
			<h1 className='text-5xl font-bold leading-tight line-clamp-3'>ConfessIT-chat anonymous in your neighbours</h1>
			<h2 className='text-xl text-gray-400 mt-4 max-w-2xl'>Get Acsses to closer channels and join them anonymously</h2>
			<div className='flex items-center gap-2 p-3'>
				<Link href={'/rooms'}><Button>Join Rooms Near Me</Button></Link>
				<Button variant={'outline'} className='hover:border-gray-900 border-black '  >How It Works</Button>
			</div>
		</div>
	)
}

export default LandingPage