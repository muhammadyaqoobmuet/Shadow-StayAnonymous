import { Button } from '@/components/ui/button'
import { Ghost } from 'lucide-react'
import Container from './Container'

const NavBar = () => {
	return (
		<nav className='border-b border-gray-100'>
			<Container>
				<div className='flex items-center justify-between py-4'>
					<div className="flex items-center gap-2 font-bold tracking-tight select-none">
						<div className="w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center">
							<Ghost size={18} fill="currentColor" />
						</div>
						<span className="text-foreground hidden sm:inline">SHADOW</span>
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