import { Router } from "express";
const router: Router = Router();
import * as controller from "../controllers/auth.controller";

router.get("/login", controller.login);

router.post("/login", controller.loginPost);

router.get("/register", controller.register);

router.post("/register", controller.registerPost);

export const authRoute: Router = router; 