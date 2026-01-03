import Room from "../models/room.model";
import { Response } from "express";

interface GroupChat {
  title: string;
  avatar: string;
  typeRoom: string;
  room_chat_id: string;
  lastMessage: string;
  updatedAt: Date;
}

const getRoomGroup = async (res: Response): Promise<GroupChat[]> => {
  const userLogined = res.locals.user.id as string;

  const rooms: any = await Room.find({
    typeRoom: "group",
    "members.user_id": userLogined,
    deleted: false,
  }).sort({ updatedAt: -1 }).lean();

  const allRooms = rooms.map((item: any): GroupChat | null => {
    return {
      title: item.title || "Không có tiều đề",
      avatar: item.avatar,
      typeRoom: item.typeRoom,
      room_chat_id: item._id.toString(),
      lastMessage: item.lastMessage || "",
      updatedAt: item.updatedAt,
    }
  }).filter((item: GroupChat) => item != null);

  return allRooms;
};


export default getRoomGroup;

