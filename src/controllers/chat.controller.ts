import { Request, Response } from "express";
import Chat from "../models/chat.model";
import User from "../models/user.model";
import chatSocket from "../socket/chat.socket";
import getInfoRoom from "../helpers/getInfoRoom.helper";

// [get] /chat?roomId; 
export const index = async (req: Request, res: Response) => {
  try {
    const userLogined: string = res.locals.user.id;
    const roomId = (req.query.roomId as string) || "";
    let chats: any[] = [];
    let infoRoom: any = null;

    const users = await User.find({
      _id: { $ne: userLogined },
      deleted: false
    }).select("-password");

    if (roomId) {
      chats = await Chat.find({
        deleted: false,
        room_id: roomId
      });
      for (let chat of chats) {
        const user = await User.findOne({
          _id: chat.user_id,
        }).select("fullName");
        chat.fullName = user?.fullName;
      }
      const objectRoom = await getInfoRoom(req, res);
      if (objectRoom) {
        infoRoom = objectRoom;
      }
      chatSocket(roomId, res);
    }
    res.render("pages/chat/index", {
      title: "Chat-app",
      users: users,
      chats: chats,
      infoRoom: infoRoom,
    });
  } catch (error) {
    console.log(error);
  }
}