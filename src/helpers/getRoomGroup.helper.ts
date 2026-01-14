import Room from "../models/room.model";
import { Response } from "express";

interface GroupChat {
  title: string;
  avatar: string;
  typeRoom: string;
  room_chat_id: string;
  status: ["sent", "seen"];
  _id: string;
  lastMessage: string;
  updatedAt: Date;
}

const getRoomGroup = async (res: Response): Promise<GroupChat[]> => {
  try {
    const userLogined = res.locals.user.id as string;

    const rooms: any = await Room.find({
      typeRoom: "group",
      "members.user_id": userLogined,
      deleted: false,
    })
      .sort({ updatedAt: -1 })
      .lean()
      .populate({
        path: "lastMessageId",
        select: "content status user_id"
      });

    const allRooms = rooms.map((item: any): GroupChat => {
      return {
        title: item.title || "Nhóm không tên",
        avatar: item.avatar || "/images/default-avatar.webp",
        typeRoom: item.typeRoom,
        room_chat_id: item._id.toString(),
        lastMessage: item.lastMessageId ? item.lastMessageId.content : "Bắt đầu cuộc trò chuyện",
        status: item.status,
        _id: item.lastMessageId.user_id,
        updatedAt: item.updatedAt,
      };
    });

    return allRooms;

  } catch (error) {
    console.log("Lỗi lấy danh sách nhóm:", error);
    return [];
  }
};

export default getRoomGroup;