import { Button } from '@/components/ui/button'
import Container from './Container'

const NavBar = () => {
	return (
		<nav className='border-b border-gray-100'>
			<Container>
				<div className='flex items-center justify-between py-4'>
					<div className=''>
						<h1 className='text-xl font-bold tracking-tight'>SHADOWNCHAT</h1>
					</div>
					<Button className='rounded-full px-6'>
						Create Account
					</Button>
				</div>
			</Container>
		</nav>
	)
}

export default NavBar