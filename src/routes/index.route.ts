import { Express } from "express";
import { chatRoute } from "./chat.route";
import { authRoute } from "./auth.route";
import authMiddleware from "../middlewares/auth.middlewares";

const indexRoute = (app: Express) => {

  app.use("/auth", authRoute);

  app.use("/", authMiddleware, chatRoute);
}

export default indexRoute; 