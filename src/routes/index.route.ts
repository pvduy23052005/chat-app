import { Express } from "express";
import { chatRoute } from "./chat.route";
import { authRoute } from "./auth.route";
import authMiddleware from "../middlewares/auth.middlewares";
import { userRoute } from "./user.route";

const indexRoute = (app: Express) => {

  app.use("/auth", authRoute);

  app.use("/chat", authMiddleware, chatRoute);

  app.use("/user", authMiddleware, userRoute);
}

export default indexRoute; 