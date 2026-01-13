
import React from 'react'
import { Inter } from 'next/font/google'

const inter = Inter({
	subsets: ['latin'],
	display: 'swap',
})

const Container = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className={`max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 ${inter.className}`}>
			{
				children
			}

		</div>
	)
}

export default Container