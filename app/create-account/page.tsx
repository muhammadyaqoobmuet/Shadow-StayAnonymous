"use client"
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { z } from "zod"

const formSchema = z.object({
	username: z.string(),
})

const Page = () => {
	const generatedUsername = useMemo(() => `user${Math.floor(Math.random() * 100000)}`, [])

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: generatedUsername,
		},
	})

	const onSubmit = (values: z.infer<typeof formSchema>) => {
		console.log(values)
	}

	return (
		<div className='flex min-h-screen items-center justify-center p-3'>
			<form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-sm space-y-4 border p-6 rounded-lg shadow-md">
				<div className="flex flex-col space-y-1.5">
					<label htmlFor="username" className="text-sm font-semibold">Username</label>
					<input
						{...form.register("username")}
						id="username"
						readOnly
						className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed outline-none"
					/>
					<p className="text-xs text-gray-500">Auto-generated username cannot be edited.</p>
				</div>
				<Button type="submit" className="w-full  text-white py-2 rounded hover:bg-gray-900 transition-colors">
					Create Account
				</Button>
			</form>
		</div>
	)
}

export default Page