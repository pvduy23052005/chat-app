import { Express } from "express";
import { chatRoute } from "./chat.route";
import { authRoute } from "./auth.route";

const indexRoute = (app: Express) => {

  app.use("/auth", authRoute);

  app.use("/", chatRoute);
}

export default indexRoute; 