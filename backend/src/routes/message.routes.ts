import { Router } from "express";
import { getMessageByRoomID } from "../controllers/message.controler.js";

export const messageRouter = Router()

messageRouter.get('/:roomId', getMessageByRoomID)
