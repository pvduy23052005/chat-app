import { Socket } from "socket.io";
import { Response } from "express";
import Chat from "../models/chat.model";
import { uploadCloud } from "../helpers/uploadCloud";

const chatSocket = async (roomId: string, res: Response): Promise<void> => {
  const userLogined = res.locals.user.id;
  const fullName = res.locals.user.fullName;

  _io.once("connection", (socket: Socket) => {
    socket.join(roomId);
    console.log(`user connected : ${userLogined}`);
    // server on event .
    socket.on("CLIENT_SEND_MESSAGE", async (data) => {
      const images = data.images;
      const imageUrls = await uploadCloud(images);

      const newChat = new Chat({
        user_id: userLogined,
        content: data.message,
        images: imageUrls,
      });
      await newChat.save();

      // server emit event . 
      _io.to(roomId).emit("SERVER_SEND_MESSAGE", {
        user_id: userLogined,
        fullName: fullName,
        content: data.message,
        images: imageUrls,
      })

    });

    socket.on("CLIENT_SEND_TYPING", (data) => {
      socket.broadcast.to(roomId).emit("SERVER_SEND_TYPING", {
        user_id: userLogined,
        fullName: fullName,
        type: data
      })
    })
  })
}

export default chatSocket;