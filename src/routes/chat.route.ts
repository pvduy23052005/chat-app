import { Router } from "express";
const router: Router = Router();
import * as controller from "../controllers/chat.controller";
import chatMiddleware from "../middlewares/chat.middleware";

router.get("/", chatMiddleware, controller.index);

router.get("/not-friend", chatMiddleware, controller.chatNotFriend);

export const chatRoute: Router = router  