// for auth checking

import type { Socket } from "socket.io";
import { verifyToken } from "../utils/jwt.js";
import redisClient from "../db/reddis.js";


export async function socketAuthMiddleware(socket: Socket, next: any) {
	try {
		const token = socket.handshake.auth.token;
		if (!token) {
			return next(new Error("no token provided"));
		}
		const decoded = verifyToken(token);
		const sessionExists = await redisClient.get(`sessions:${token}`);
		if (!sessionExists) {
			return next(new Error("session expired try again creating new account"));
		}

		//@ts-ignore
		socket.user = decoded;
		next();
	} catch (error) {
		console.error(error);
		next(error);
	}
}