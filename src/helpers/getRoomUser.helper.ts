import { Response } from "express";
import Room from "../models/room.model";

export interface UserChatSidebar {
  _id: string;
  fullName: string;
  avatar: string;
  room_chat_id: string;
  statusOnline: "online" | "offline";
  lastMessage: string;
}

const getRoomUser = async (res: Response, status: string = "accepted"): Promise<UserChatSidebar[]> => {
  const userLogined: string = res.locals.user.id;

  const rooms: any = await Room.find({
    typeRoom: "single",
    "members": {
      $elemMatch: {
        user_id: userLogined,
        status: status
      }
    },
  })
    .sort({ updatedAt: -1 })
    .populate({
      path: "members.user_id",
      select: "fullName avatar statusOnline"
    });

  const users = rooms.map((room: any): UserChatSidebar | null => {
    const otherMember = room.members.find(
      (member: any) => member.user_id._id.toString() !== userLogined
    );

    if (otherMember && otherMember.user_id) {
      const user: any = otherMember.user_id;

      return {
        _id: user._id.toString(),
        fullName: user.fullName,
        avatar: user.avatar,
        room_chat_id: room.id.toString(),
        statusOnline: user.statusOnline || "offline",
        lastMessage: room.lastMessage || ""
      };
    }
    return null;
  }).filter((user: UserChatSidebar) => user != null);

  return users;
}

export default getRoomUser;