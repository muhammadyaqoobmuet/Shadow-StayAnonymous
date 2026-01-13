declare namespace NodeJS {
	interface ProcessEnv {
		JWT_SECRET: string
		REDIS_HOST?: string
		REDIS_URI?: string
		MONGO_URI: string
	}
}
