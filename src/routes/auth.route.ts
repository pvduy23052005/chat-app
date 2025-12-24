import { Router } from "express";
const router: Router = Router();
import * as controller from "../controllers/auth.controller";

router.get("/login", controller.login);

router.get("/register", controller.register);

export const authRoute: Router = router; 