import { create } from "zustand"
import { persist } from "zustand/middleware"


interface RoomLocation {
	type: string
	coordinates: [number, number]
}

interface RoomDetails {
	name: string
	location: RoomLocation
	_id: string
	__v?: number
}

interface RoomData {
	success: boolean
	message: string
	room: RoomDetails
}

type UserStore = {
	name: string
	coordinates: [number, number] | null
	myRooms: RoomData[]
	setName: (name: string) => void
	setCoordinates: (coords: [number, number]) => void
	setMyRooms: (roomDetails: RoomData) => void
	clearUser: () => void
}

export const userStore = create<UserStore>()(
	persist(
		(set, get) => ({
			// state
			name: "",
			coordinates: null,
			myRooms: [],

			// actions
			setName: (name) => set({ name }),
			setCoordinates: (coords) => set({ coordinates: coords }),

			// add new room to existing array
			setMyRooms: (roomDetails) =>
				set({ myRooms: [...get().myRooms, roomDetails] }),

			clearUser: () => set({ name: "", coordinates: null, myRooms: [] }),
		}),
		{
			name: "user-store", // localStorage key
		}
	)
)
