import { z } from "zod";

export const roomZodSchema = z.object({
	name: z
		.string()
		.min(1, "Room name is required")
		.max(30, "Max 15 letters are allowed"),

	location: z.object({
		type: z.literal("Point"),
		coordinates: z
			.array(z.number())
			.length(2, "Coordinates must be [longitude, latitude]")
	})
});
