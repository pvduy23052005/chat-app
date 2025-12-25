import { Request, Response } from "express";
import Chat from "../models/chat.model";
import User from "../models/user.model";
import chatSocket from "../socket/chat.socket";

export const index = async (req: Request, res: Response) => {
  const userLogined: String = res.locals.user.id;

  const users = await User.find({
    _id: { $ne: userLogined },
    deleted: false
  }).select("-password");
  const chats: any = await Chat.find({
    deleted: false
  });
  for (let chat of chats) {
    const user = await User.findOne({
      _id: chat.user_id,
    }).select("fullName");

    chat.fullName = user?.fullName;
  }

  chatSocket(res);

  res.render("pages/chat/index", {
    title: "Chat-app",
    users: users,
    chats: chats
  });
}