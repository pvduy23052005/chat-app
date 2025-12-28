import { Request, Response } from "express";
import User from "../models/user.model";
import Room from "../models/room.model";

interface objectRoom {
  titleRoom?: string,
  avatarRoom?: string
}

// get titleRoom , avataRoom ; 
const getInfoRoom = async (req: Request, res: Response): Promise<objectRoom> => {
  const roomId = req.query.roomId || "" as string;
  const userLogined: string = res.locals.user.id;

  let objectRoom: objectRoom = {};

  const room: any = await Room.findOne({
    _id: roomId,
    deleted: false,
  });

  let titleRoom: string = room.title || "";
  let avatarRoom: string = "/images/default-avatar.webp";
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
        titleRoom += user.fullName;
        avatarRoom = user.avatar || "/images/default-avatar.webp";
      }
    }
  }
  objectRoom.titleRoom = titleRoom;
  objectRoom.avatarRoom = avatarRoom;

  return objectRoom;
}

export default getInfoRoom;