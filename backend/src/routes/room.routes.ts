import { Router } from "express";
import { createRoom, getRooms, joinRoom, checkMembership } from "../controllers/room.controller.js";
import { zodValidatorMiddleware } from "../middleware/zodSchemaValidator.js";
import { roomZodSchema } from "../schema/roomRegister.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

export const roomRouter = Router()


roomRouter.post('/create-room', authMiddleware, zodValidatorMiddleware(roomZodSchema), createRoom);



roomRouter.get('/rooms', authMiddleware, getRooms);
roomRouter.post('/:roomId/join', authMiddleware, joinRoom);
roomRouter.get('/:roomId/membership', authMiddleware, checkMembership);

