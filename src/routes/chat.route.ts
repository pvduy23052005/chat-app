import { Router } from "express";
const router: Router = Router();
import * as controller from "../controllers/chat.controller";

router.get("/", controller.index);

router.get("/not-friend", controller.chatNotFriend);

export const chatRoute: Router = router  