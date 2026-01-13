"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogClose,
} from "../ui/dialog";
import axios from "axios";
import { userStore } from "@/stores/user-store";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Plus, Radio, Signal, Loader2, X, Activity, Globe, AlertCircle } from "lucide-react";

const roomSchema = z.object({
	name: z
		.string()
		.min(1, "Room name is required")
		.max(30, "Room name must be 15 characters or less"),
});

type RoomForm = z.infer<typeof roomSchema>;

export function CreateRoom() {
	const setCords = userStore((state) => state.setCoordinates);
	const setMyRooms = userStore((state) => state.setMyRooms);
	const coordinates = userStore((state) => state.coordinates);
	const myRooms = userStore((state) => state.myRooms);

	const [isOpen, setIsOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [roomLeft, setRoomLeft] = useState(3);

	const { register, handleSubmit, reset, formState: { errors } } = useForm<RoomForm>({
		resolver: zodResolver(roomSchema),
		defaultValues: {
			name: ""
		}
	});

	useEffect(() => {
		// Calculate room left based on current store
		setRoomLeft(3 - myRooms.length);
	}, [myRooms]);

	async function onSubmit(data: RoomForm) {
		setIsSubmitting(true);

		const executeCreateRoom = async (latitude: number, longitude: number) => {
			try {
				const res = await axios.post(
					`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/room/create-room`,
					{
						name: data.name,
						location: {
							type: "Point",
							coordinates: [longitude, latitude],
						}
					},
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem("token")}`,
						},
					}
				);
				if (res.data.success) {
					toast.success("Signal broadcast established");
					setMyRooms(res.data);
					setIsOpen(false);
					reset();
				}
			} catch (error: any) {
				toast.error(error.response?.data?.message || error.response?.data.error || "Failed to establish signal");
			} finally {
				setIsSubmitting(false);
			}
		};

		if (coordinates) {
			await executeCreateRoom(coordinates[0], coordinates[1]);
		} else {
			navigator.geolocation.getCurrentPosition(
				async (location) => {
					const { latitude, longitude } = location.coords;
					setCords([latitude, longitude]);
					await executeCreateRoom(latitude, longitude);
				},
				() => {
					toast.error("GPS synchronization failed");
					setIsSubmitting(false);
				}
			);
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<button suppressHydrationWarning={true} className="flex items-center justify-center gap-2 px-2 sm:px-4 py-2 bg-white text-black text-xs font-black tracking-widest uppercase hover:bg-zinc-200 transition-all border border-white min-w-[40px]">
					<Plus size={16} strokeWidth={3} />
					<span className="hidden sm:inline">Create Signal</span>
				</button>
			</DialogTrigger>
			<DialogContent showCloseButton={false} className="bg-background border-border sm:max-w-[425px] p-0 overflow-hidden rounded-none shadow-2xl">
				<div className="absolute inset-0 bg-grid-pattern bg-grid-sm opacity-[0.03] pointer-events-none" />

				<div className="p-6 relative z-10">
					<div className="flex justify-between items-start mb-8">
						<DialogHeader>
							<div className="flex items-center gap-3 mb-2">
								<div className="w-8 h-8 bg-surface border border-border flex items-center justify-center text-foreground">
									<Radio size={16} />
								</div>
								<DialogTitle className="text-foreground text-xl font-black tracking-tighter uppercase italic">Signal Generator</DialogTitle>
							</div>
							<p className="text-muted-foreground text-[10px] font-mono uppercase tracking-[0.2em] leading-relaxed">
								Initializing localized frequency sequence.
							</p>
						</DialogHeader>
						<DialogClose className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-primary/5 rounded-none border border-transparent hover:border-border">
							<X size={20} />
						</DialogClose>
					</div>

					<div className="mb-8 grid grid-cols-2 gap-2">
						<div className="bg-surface border border-border p-3 space-y-1">
							<div className="flex items-center gap-2 text-[9px] font-mono text-muted-foreground uppercase tracking-widest">
								<Activity size={10} className="text-accent" /> Capacity
							</div>
							<div className="text-sm font-mono text-foreground uppercase tracking-tighter">
								{roomLeft} / 3 <span className="text-[10px] opacity-50">available</span>
							</div>
						</div>
						<div className="bg-surface border border-border p-3 space-y-1">
							<div className="flex items-center gap-2 text-[9px] font-mono text-muted-foreground uppercase tracking-widest">
								<Globe size={10} className="text-accent" /> Vector
							</div>
							<div className="text-[10px] font-mono text-foreground truncate">
								{coordinates ? `${coordinates[0].toFixed(2)}, ${coordinates[1].toFixed(2)}` : 'UNKNOWN'}
							</div>
						</div>
					</div>

					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
						<div className="space-y-2">
							<div className="flex justify-between items-end px-1">
								<label className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.3em]">Identifier</label>
								{errors.name && (
									<span className="text-[9px] font-mono text-destructive uppercase tracking-wider flex items-center gap-1">
										<AlertCircle size={10} /> {errors.name.message}
									</span>
								)}
							</div>
							<input
								{...register("name")}
								placeholder="my-cool-room"
								className={`w-full bg-surface border ${errors.name ? 'border-destructive/50' : 'border-border'} rounded-none px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/20 transition-all font-mono placeholder:text-muted-foreground/30`}
							/>
						</div>

						<div className="pt-4 space-y-3">
							<button
								type="submit"
								disabled={isSubmitting || roomLeft <= 0}
								className="w-full py-4 bg-primary text-primary-foreground font-black text-xs tracking-[0.2em] uppercase hover:bg-primary/90 transition-all flex items-center justify-center gap-3 disabled:opacity-20 disabled:cursor-not-allowed"
							>
								{isSubmitting ? (
									<>
										<Loader2 className="animate-spin" size={14} />
										<span>Broadcasting...</span>
									</>
								) : (
									<>
										<Signal size={14} />
										<span>{roomLeft <= 0 ? 'QUOTA EXCEEDED' : 'Generate Signal'}</span>
									</>
								)}
							</button>
							<p className="text-[9px] text-muted-foreground font-mono text-center uppercase tracking-[0.2em]">
								Transmission requires active GPS sync
							</p>
						</div>
					</form>
				</div>
			</DialogContent>
		</Dialog>
	);
}
