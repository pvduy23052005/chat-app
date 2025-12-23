import { Request, Response } from "express";


export const index = (req: Request, res: Response) => {
  res.render("pages/chat/index", {
    title: "Chat-app"
  });
}