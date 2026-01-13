import { z } from "zod";

export type UserState = {
	name: string
	cordinates: [number, number] | null
}

export type UserActions = {
	setName: (name: string) => void
	setCoordinates: (cords: [number, number]) => void
}


export const roomZodSchema = z.object({
	name: z
		.string()
		.min(4, "Room name must be of more than 4 chars")
		.max(15, "Max 15 letters are allowed"),
});


export type roomName = z.infer<typeof roomZodSchema>


export type UserStore = UserState & UserActions

export type Room = {
	_id: string
	name: string
	location: {
		type: "Point"
		coordinates: [number, number] // [longitude, latitude]
	}
	distance: number
	distanceInMeters: number
	distanceInKm: number
	joined: boolean
	totalMembers: number
	totalOnline: number
}

