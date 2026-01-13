import { Redis } from "ioredis"

const redisClient = new Redis(process.env.REDIS_URI as string)

redisClient.on("connect", () => {
	console.log(" Redis connected")
})

redisClient.on("error", (err) => {
	console.error(" Redis error:", err)
})

export default redisClient;
