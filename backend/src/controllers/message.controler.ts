import type { Request, Response, NextFunction } from "express"

import { Message } from "../models/Message.js"
export async function getMessageByRoomID(req: Request, res: Response, next: NextFunction) {
	try {
		const { roomId } = req.params
		if (!roomId) {
			return res.status(400).json({
				success: false,
				message: "are you crazy or what LOL"
			})
		}
		// lets find
		const messages = await Message.find({ roomId }).sort({ createdAt: -1 }).limit(50)
		if (!messages) {
			return res.status(200).json({
				success: true,
				messages: []
			})
		}

		return res.status(200).json({
			success: true,
			messages,
		})
	} catch (error) {
		console.log(error)
		next(error)
	}
}