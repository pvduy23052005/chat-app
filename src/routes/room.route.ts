import { Router } from "express";
const router: Router = Router();
import * as controller from "../controllers/room.controller";

router.get("/create", controller.create);

router.post("/create", controller.createPost);

router.get("/detail/:id", controller.detail);

router.post("/remove-member", controller.removeMember);

router.post("/add-member/:id", controller.addMember);

router.post("/delete/:id", controller.deletePost);

export const roomRoute: Router = router; 