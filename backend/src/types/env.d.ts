declare namespace NodeJS {
	interface ProcessEnv {
		JWT_SECRET: string
		REDIS_HOST?: string
		REDIS_PORT?: string
		MONGO_URI: string
	}
}
