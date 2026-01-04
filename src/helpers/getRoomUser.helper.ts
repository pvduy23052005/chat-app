import { Response } from "express";
import Room from "../models/room.model";

export interface UserChatSidebar {
  _id: string;
  fullName: string;
  title: string;
  avatar: string;
  room_chat_id: string;
  statusOnline: "online" | "offline";
  lastMessage: string;
  updatedAt: Date;
  typeRoom: string;
}

const getRoomUser = async (res: Response, status: string = "accepted"): Promise<UserChatSidebar[]> => {
  try {
    const userLogined: string = res.locals.user.id;

    const rooms: any = await Room.find({
      typeRoom: "single",
      "members": {
        $elemMatch: {
          user_id: userLogined,
          status: status
        }
      },
      deleted: false,
    })
      .sort({ updatedAt: -1 })
      .lean() 
      .populate({
        path: "members.user_id",
        select: "fullName avatar statusOnline"
      })
      .populate({ 
        path: "lastMessageId",
        select: "content"
      });

    const users = rooms.map((room: any): UserChatSidebar | null => {
      const otherMember = room.members.find(
        (member: any) => member.user_id && member.user_id._id.toString() !== userLogined
      );

      if (otherMember && otherMember.user_id) {
        const user: any = otherMember.user_id;

        return {
          _id: user._id.toString(),
          fullName: user.fullName,
          title: user.fullName,
          avatar: user.avatar || "/images/default-avatar.webp",
          room_chat_id: room._id.toString(),
          statusOnline: user.statusOnline || "offline",
          lastMessage: room.lastMessageId ? room.lastMessageId.content : "Bắt đầu cuộc trò chuyện",
          updatedAt: room.updatedAt,
          typeRoom: "single"
        };
      }
      return null;
    }).filter((user: UserChatSidebar | null) => user !== null) as UserChatSidebar[];
    return users;
  } catch (error) {
    console.log("Lỗi getRoomUser:", error);
    return [];
  }
}

export default getRoomUser;