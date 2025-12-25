import { Socket } from "socket.io";
import { Response } from "express";
import Chat from "../models/chat.model";

const chatSocket = async (res: Response): Promise<void> => {
  const userLogined = res.locals.user.id;
  const fullName = res.locals.user.fullName;

  _io.once("connection", (socket: Socket) => {
    // server on event .
    socket.on("CLIENT_SEND_MESSAGE", async (data) => {
      const newChat = new Chat({
        user_id: userLogined,
        content: data.message,
      });
      await newChat.save();

      // server emit event . 
      _io.emit("SERVER_SEND_MESSAGE", {
        user_id: userLogined,
        fullName: fullName,
        content: data.message
      })

    });
  })
}

export default chatSocket;