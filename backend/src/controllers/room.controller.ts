import type { NextFunction, Response } from "express";
import type { roomSchemaI, ExtendedRequest } from "../types/index.js";
import { Room } from "../models/Rooms.js";




export const createRoom = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
	try {
		const data = req.data as roomSchemaI;
		console.log(data)
		// data checked from zod always come here otherwise middleware will through error
		// save the data
		const room = await Room.create({
			name: data.name,
			location: data.location
		})

		res.status(200).json({
			success: true,
			message: "room created ",
			room,
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

		res.json({
			success: true,
			count: rooms.length,
			radius: `${rad}km`,
			rooms: rooms
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