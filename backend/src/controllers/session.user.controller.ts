import type { Request, Response, NextFunction } from "express"
import { getJWT } from "../utils/jwt.js"
import redisClient from "../db/reddis.js";

export async function getSession(req: Request, res: Response, next: NextFunction) {

	try {
		const session = getJWT();
		if (!session) {
			return res.status(500).json({
				message: "Could not establish session"
			});
		}
		const { name, token } = session;
		await redisClient.set(`sessions:${token}`, JSON.stringify(token), "EX", 5 * 60 * 60);
		res.status(200).json({
			name,
			token,
			createdAt: Date.now()
		})
	} catch (error) {
		next(error);
	}
}