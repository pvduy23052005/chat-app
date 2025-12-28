import { Request, Response } from "express";
import Chat from "../models/chat.model";
import User from "../models/user.model";
import chatSocket from "../socket/chat.socket";
import Room from "../models/room.model";

// [get] /chat/:roomId; 
export const index = async (req: Request, res: Response) => {
  const userLogined: string = res.locals.user.id;
  const roomId: string = req.params.roomId || "";

  const users = await User.find({
    _id: { $ne: userLogined },
    deleted: false
  }).select("-password");

  const room: any = await Room.findOne({
    _id: roomId,
    deleted: false,
  });

  let titleRoom = room.title;
  let avatarRoom = "/images/group-avatar.webp";
  if (room.typeRoom === "single") {
    const otherMember = room.members.find(
      (member: any) => member.user_id.toString() !== userLogined.toString()
    );
    if (otherMember) {
      const user = await User.findOne({
        _id: otherMember.user_id,
        deleted: false
      }).select("fullName avatar");
      if (user) {
        titleRoom = user.fullName;
        avatarRoom = user.avatar || "/images/default-avatar.webp";
      }
    }
  }

  const chats: any = await Chat.find({
    deleted: false,
    room_id: roomId
  });

  for (let chat of chats) {
    const user = await User.findOne({
      _id: chat.user_id,
    }).select("fullName");
    chat.fullName = user?.fullName;
  }

  chatSocket(room.id, res);

  res.render("pages/chat/index", {
    title: "Chat-app",
    users: users,
    chats: chats,
    titleRoom: titleRoom,
    avatarRoom: avatarRoom,
  });
}