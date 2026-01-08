import { Router } from "express";
import getUniqueUser from "../utils/genrateUniqueUser.js";
import { getSession } from "../controllers/session.user.controller.js";

export const userAuthRouter = Router();
userAuthRouter.route('/session').get(getSession);