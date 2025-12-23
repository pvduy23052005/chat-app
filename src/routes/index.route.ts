import { Express } from "express";
import { chatRoute } from "./chat.route";

const indexRoute = (app: Express) => {

  app.use("/", chatRoute);
}

export default indexRoute; 