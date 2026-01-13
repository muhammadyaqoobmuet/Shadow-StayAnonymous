
import type { Response, NextFunction } from "express"
import { z, type ZodType } from "zod"
import type { ExtendedRequest } from "../types/index.js";
export const zodValidatorMiddleware = (zodSchema: ZodType) => (req: ExtendedRequest, res: Response, next: NextFunction) => {

	const result = zodSchema.safeParse(req.body);
	if (!result.success) {
		res.status(400).json({
			success: false,
			error: result.error.issues[0]?.message || "Validation failed"
		})
		return;
	}
	req.data = result.data;
	next();
}