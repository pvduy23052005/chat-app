import { Router } from "express";
const router: Router = Router();
import * as controller from "../controllers/user.controller";

router.get("/", controller.index);

router.get("/friend-accepts", controller.friendAccepts);

export const userRoute: Router = router; 