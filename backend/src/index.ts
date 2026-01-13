import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import helmet from "helmet"
import { createServer } from "http"
import { Server, Socket } from "socket.io"
import redisClient from "./db/reddis.js"
import { socketAuthMiddleware } from "./middleware/socket.middleware.js"
import { connect } from "http2"
import { connectDb } from "./db/db.js"
import { roomRouter } from "./routes/room.routes.js"
import { userAuthRouter } from "./routes/user.auth.routes.js"
import { Message } from "./models/Message.js"
import { nextTick } from "process"
import { globalErrorHandler } from "./middleware/globalErrorHandler.js"
import { messageRouter } from "./routes/message.routes.js"
import { RedisStore, type RedisReply } from 'rate-limit-redis'
import rateLimit from "express-rate-limit"

dotenv.config()
const app = express();

export const limiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 5 minture
	max: 10,
	standardHeaders: true,
	legacyHeaders: false,
	store: new RedisStore({
		sendCommand: (command: string, ...args: string[]) =>
			redisClient.call(command, ...args) as Promise<RedisReply>,
	})
})
Promise.resolve(connectDb())
app.use(express.json())
app.use(cors())
app.use(helmet())
app.use('/api/auth', limiter, userAuthRouter)
app.use('/api/room', roomRouter)
app.use('/api/message', messageRouter)

const httpServer = createServer(app)


const io = new Server(httpServer, {
	cors: {
		origin: "http://localhost:3001",
		allowedHeaders: "*"
	}
})

io.use(socketAuthMiddleware)

io.on("connection", async (socket: Socket) => {
	// @ts-ignore
	const userId = socket.user.name
	console.log("connected:", userId)

	// get all rooms user belongs to
	const rooms = await redisClient.smembers(`user:${userId}:rooms`)

	// auto join rooms
	for (const roomId of rooms) {
		socket.join(roomId)
		await redisClient.sadd(`room:${roomId}:online`, userId)

		io.to(roomId).emit("user_joined", {
			roomId,
			userId
		})
	}

	const activeRooms = new Set<string>(rooms)

	socket.on("join_room", async (roomId: string) => {
		try {
			const isMember = await redisClient.sismember(`room:${roomId}:members`, userId)
			if (!isMember) return

			socket.join(roomId)
			activeRooms.add(roomId)
			await redisClient.sadd(`room:${roomId}:online`, userId)

			io.to(roomId).emit("user_joined", {
				roomId,
				userId
			})
		} catch (error) {
			console.error("Error joining room:", error)
		}
	})


	socket.on("send_message", async (roomId: string, message: string) => {
		try {
			const isMember = await redisClient.sismember(`room:${roomId}:members`, userId)
			if (!isMember) return

			io.to(roomId).emit("receive_message", {
				roomId,
				userId,
				message,
				timestamp: new Date()
			})
			// saving to mongodb
			await Message.create({
				userId,
				roomId,
				content: message
			})
		} catch (error) {
			console.error(error)
			throw error;
		}
	})


	socket.on("typing_start", (roomId: string) => {
		socket.to(roomId).emit("user_typing", {
			roomId,
			userId
		})
	})

	socket.on("typing_stop", (roomId: string) => {
		socket.to(roomId).emit("user_stopped_typing", {
			roomId,
			userId
		})
	})


	socket.on("disconnect", async () => {
		for (const roomId of activeRooms) {
			await redisClient.srem(`room:${roomId}:online`, userId)

			io.to(roomId).emit("user_left", {
				roomId,
				userId
			})
		}
	})
})
app.use(globalErrorHandler)
httpServer.listen(3000, () => {
	console.log("socket server running 🚀")
})
