import type { NextFunction, Response } from "express";
import type { roomSchemaI, ExtendedRequest } from "../types/index.js";
import { Room } from "../models/Rooms.js";
import redisClient from "../db/reddis.js";




export const createRoom = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
	try {
		const data = req.data as roomSchemaI;



		const user = req.user.name;
		const key = `user:${user}:room_tokens`;

		const ROOM_LIMIT = 3;
		const WINDOW = 5 * 60 * 60; // 5 hours

		const script = `
local key = KEYS[1]
local limit = tonumber(ARGV[1])
local ttl = tonumber(ARGV[2])

local current = redis.call("GET", key)

if current == false then
    redis.call("SET", key, limit - 1, "EX", ttl)
    return limit - 1
end

current = tonumber(current)

if current <= 0 then
    return -1
end

redis.call("DECR", key)
return current - 1
`
		const remaining = (await redisClient.eval(script, 1, key, ROOM_LIMIT, WINDOW)) as number;

		if (remaining === -1) {
			return res.status(429).json({
				success: false,
				message: "Room creation limit reached. Please try again after 5 hours."
			});
		}

		const room = await Room.create({
			name: data.name,
			location: data.location,
		})

		// Add creator to room members and user rooms
		await redisClient.sadd(`room:${room._id}:members`, user);
		await redisClient.sadd(`user:${user}:rooms`, room._id.toString());

		res.status(200).json({
			success: true,
			message: "room created ",
			room,
			remainingRoom: remaining
		})

	} catch (error) {
		console.log(error)
		next(error)
	}
}


export const getRooms = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
	try {
		const { longitude, latitude, radiusInKm, radius } = req.query;
		const finalRadius = radiusInKm || radius || 5;
		const name = req.user?.name;

		// Validate
		if (!longitude || !latitude) {
			return res.status(400).json({
				success: false,
				message: "longitude and latitude are required"
			});
		}

		// Parse to numbers
		const lng = parseFloat(longitude as string);
		const lat = parseFloat(latitude as string);
		const rad = parseFloat(finalRadius as string);

		if (isNaN(lng) || isNaN(lat) || isNaN(rad)) {
			return res.status(400).json({
				success: false,
				message: "Invalid coordinates or radius"
			});
		}

		const maxDistanceMeters = rad * 1000;

		// Query with distance calculation
		const rooms = await Room.aggregate([
			{
				$geoNear: {
					near: {
						type: "Point",
						coordinates: [lng, lat]
					},
					distanceField: "distance",
					spherical: true,
					maxDistance: maxDistanceMeters
				}
			},
			{
				$project: {
					name: 1,
					location: 1,
					distance: 1,
					distanceInMeters: { $round: ["$distance", 0] },
					distanceInKm: { $divide: [{ $round: ["$distance", 0] }, 1000] }
				}
			},
			{
				$sort: { distance: 1 }
			}
		]);

		// Check membership for each room
		const joinedRooms = name ? await redisClient.smembers(`user:${name}:rooms`) : [];

		const roomsWithDetails = await Promise.all(rooms.map(async (room) => {
			const totalMembers = await redisClient.scard(`room:${room._id}:members`);
			const totalOnline = await redisClient.scard(`room:${room._id}:online`)
			return {
				...room,
				joined: joinedRooms.includes(room._id.toString()),
				totalMembers: totalMembers || 0,
				totalOnline: totalOnline || 0,
			};
		}));

		res.json({
			success: true,
			count: rooms.length,
			radius: `${rad}km`,
			rooms: roomsWithDetails
		});
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({
				success: false,
				error: error?.message
			});
		}
		next(error);
	}
};


export const getRoomMembers = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
	try {
		const { roomId } = req.params;
		if (!roomId) {
			throw new Error('not a valid room id')
		}
		const totalMembers = await redisClient.scard(`room:${roomId}:members`)

		return res.status(200).json({
			totalMembers
		})
	} catch (error) {
		next(error)
	}
}




export const joinRoom = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
	try {
		const decoded = req.user;
		const name = decoded?.name;
		const { roomId } = req.params;

		if (!roomId) {
			return res.status(400).json({
				success: false,
				joined: false,
				message: "invalid room id"
			})
		}
		const isMember = await redisClient.sismember(`room:${roomId}:members`, name)
		if (isMember) {
			return res.status(200).json({
				success: true,
				joined: true,
				message: 'user already is member'
			})
		}
		await redisClient.sadd(`room:${roomId}:members`, name)
		// user:{userId}:rooms roomId
		await redisClient.sadd(`user:${name}:rooms`, roomId?.toString())
		return res.status(200).json({
			success: true,
			joined: true,
			message: 'user  is member now'
		})
	} catch (error) {
		console.log(error)
		next(error)
	}
}

export const checkMembership = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
	try {
		const decoded = req.user;
		const name = decoded?.name;
		const { roomId } = req.params;

		if (!roomId || !name) {
			return res.status(400).json({
				success: false,
				joined: false,
				message: "invalid room id or user"
			})
		}
		const isMember = await redisClient.sismember(`room:${roomId}:members`, name)
		return res.status(200).json({
			success: true,
			joined: !!isMember
		})
	} catch (error) {
		console.log(error)
		next(error)
	}
}

