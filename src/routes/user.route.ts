import { Router } from "express";
const router: Router = Router();
import * as controller from "../controllers/user.controller";

router.get("/", controller.index);

export const userRoute: Router = router; 