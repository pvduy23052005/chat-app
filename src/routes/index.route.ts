import { Express } from "express";
import { chatRoute } from "./chat.route";
import { authRoute } from "./auth.route";
import authMiddleware from "../middlewares/auth.middlewares";
import { userRoute } from "./user.route";
import { roomRoute } from "./room.route";

const indexRoute = (app: Express) => {

  app.use("/auth", authRoute);

  app.use("/", authMiddleware, chatRoute)
  app.use("/chat", authMiddleware, chatRoute);

  app.use("/user", authMiddleware, userRoute);

  app.use("/room", authMiddleware, roomRoute);
}

export default indexRoute; 