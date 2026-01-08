import type z from "zod";
import type { Request } from "express";
import type { roomZodSchema } from "../schema/roomRegister.js";

export type roomSchemaI = z.infer<typeof roomZodSchema>;

declare global {
	namespace Express {
		interface Request {
			data?: any;
			token?: string
		}
	}
}

export interface ExtendedRequest extends Request {
	data?: any;
	token?: string
	user?: any
}