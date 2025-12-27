import { Socket } from "socket.io";
import { Response } from "express";
import Chat from "../models/chat.model";

const chatSocket = async (res: Response): Promise<void> => {
  const userLogined = res.locals.user.id;
  const fullName = res.locals.user.fullName;

  _io.once("connection", (socket: Socket) => {
    console.log(`user connected : ${userLogined}`);
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

    socket.on("CLIENT_SEND_TYPING", (data) => {
      socket.broadcast.emit("SERVER_SEND_TYPING", {
        user_id: userLogined,
        fullName: fullName,
        type: data
      })
    })
  })
}

export default chatSocket;