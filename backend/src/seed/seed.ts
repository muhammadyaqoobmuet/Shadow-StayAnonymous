import { Room } from "../models/Rooms.js";

export const createMultipleRooms = async () => {
  try {
    const rooms = await Room.insertMany([
      {
        name: "Downtown Vibes",
        location: {
          type: "Point",
          coordinates: [74.3587, 31.5204] // Downtown Lahore
        }
      },
      {
        name: "Mall Meeting",
        location: {
          type: "Point",
          coordinates: [74.3655, 31.5241] // Packages Mall, Lahore
        }
      },
      {
        name: "Cantonment Chat",
        location: {
          type: "Point",
          coordinates: [74.3352, 31.5461] // Cantonment, Lahore
        }
      },
      {
        name: "University Hangout",
        location: {
          type: "Point",
          coordinates: [74.2624, 31.4719] // Near LUMS, Lahore
        }
      },
      {
        name: "Defence Lounge",
        location: {
          type: "Point",
          coordinates: [74.4345, 31.5241] // Defence, Lahore
        }
      }
    ]);

    console.log(`Created ${rooms.length} rooms:`, rooms);
    return rooms;
  } catch (error) {
    console.error("Error creating multiple rooms:", error);
    throw error;
  }
};