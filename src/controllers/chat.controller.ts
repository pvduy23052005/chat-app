import { Request, Response } from "express";
import { Socket } from "socket.io";
import Chat from "../models/chat.model";

export const index = (req: Request, res: Response) => {

  _io.once("connection", (socket: Socket) => {
    
    socket.on("CLIENT_SEND_MESSAGE", async (data) => {
      const newChat = new Chat({
        content: data.message,
      });
      await newChat.save();
    });
  })

  res.render("pages/chat/index", {
    title: "Chat-app"
  });
}