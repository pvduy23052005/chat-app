import { Router } from "express";
const router: Router = Router();
import * as controller from "../controllers/room.controller";

router.get("/create", controller.create);

router.post("/create", controller.createPost);

export const roomRoute: Router = router;  