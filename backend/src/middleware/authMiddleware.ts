import type { Response, NextFunction } from "express"
import redisClient from "../db/reddis.js"
import { verifyToken } from "../utils/jwt.js"
import type { ExtendedRequest } from "../types/index.js"

export const authMiddleware = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
	try {
		const authHeader = req.headers.authorization
		if (!authHeader) {
			return res.status(401).json({ success: false, message: "No token provided" })
		}

		const token = authHeader.split(" ")[1]
		if (!token) {
			return res.status(401).json({ success: false, message: "No token provided" })
		}

		
		const sessionExists = await redisClient.get(`sessions:${token}`)
		if (!sessionExists) {
			return res.status(401).json({ success: false, message: "Token expired" })
		}


		const decoded = verifyToken(token)
		if (!decoded) {
			return res.status(401).json({ success: false, message: "Invalid token" })
		}

		// Attach token and user to request
		req.token = token
		req.user = decoded

		next()
	} catch (error) {
		console.error("Auth middleware error:", error)
		return res.status(401).json({ success: false, message: "Authentication failed" })
	}
}
