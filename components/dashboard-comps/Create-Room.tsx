import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { userStore } from "@/stores/user-store"
import { roomName, roomZodSchema } from "@/types"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Form } from "../ui/form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export function CreateRoom() {
	const coordinates = userStore((state) => state.coordinates)
	const setMyRooms = userStore((state) => state.setMyRooms)
	const [lat, lng] = coordinates || [0, 0]

	const [open, setOpen] = useState(false)
	const { register, handleSubmit, formState: { errors } } = useForm<roomName>({
		resolver: zodResolver(roomZodSchema),
		values: {
			name: ''
		}
	})
	const mutation = useMutation({
		mutationKey: ['posttheroom'],
		mutationFn: (roomData: any) => {
			return axios.post('http://localhost:3000/api/room/create-room', roomData, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`
				}
			})
		},
		onSuccess: (response) => {
			console.log("Room created:", response.data);
			if (response.data && response.data.success) {
				setMyRooms(response.data);
				toast.success("Room created successfully!");
				setOpen(false);
			} else {
				toast.error(response.data?.message || "Failed to create room");
			}
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "An error occurred");
		}
	})

	const onSubmit = (formData: roomName) => {
		mutation.mutate({
			name: formData.name,
			location: {
				type: "Point",
				coordinates: [lat, lng]
			}
		})
	}

	return (

		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild >
				<Button onClick={(e) => {
					if (!coordinates) {
						e.preventDefault()
						toast.info('select location first')
						return;
					}	
					setOpen(true)
				}} variant="outline">Create Room</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Create Room</DialogTitle>
					<DialogDescription>
						creat rooms in neighbours
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4">
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="grid gap-3">
							<Label htmlFor="name-1">Room Name </Label>
							<Input {...register("name")} id="name-1" name="name" defaultValue="Pedro Duarte" />
						</div>
						<div className="grid gap-3">
							<Label htmlFor="username-1">Current Cords</Label>
							<Input id="username-1" disabled name="username" defaultValue={`${lat.toFixed(4).toString()}, ${lng.toFixed(4).toString()}`} />
							<div>{errors.name && <p className="text-sm text-red-700">{errors.name.message}</p>}</div>
						</div>

						<DialogFooter>
							<DialogClose asChild>
								<Button disabled={mutation.isPending} variant="outline">Cancel</Button>
							</DialogClose>
							<Button disabled={mutation.isPending} type="submit">Create</Button>
						</DialogFooter>
					</form>
				</div>

			</DialogContent>
		</Dialog >
	)
}
