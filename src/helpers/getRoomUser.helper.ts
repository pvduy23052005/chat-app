import { Response } from "express";
import User from "../models/user.model";
import Room from "../models/room.model"

const getRoomUser = async (res: Response, status: string) => {
  const userLogined: string = res.locals.user.id;

  const rooms = await Room.find({
    typeRoom: "single",
    "members": {
      $elemMatch: {
        user_id: userLogined,
        status: status
      }
    },
  });
  const listRoomChat = [];
  for (const room of rooms) {
    const ortherMember = room.members.find(
      (member: any) => member.user_id != userLogined
    );
    if (ortherMember) {
      listRoomChat.push({
        user_id: ortherMember.user_id,
        room_id: room.id,
      })
    }
  }
  const listIdUser = listRoomChat.map((item) => item.user_id);
  const users: any = await User.find({
    _id: { $in: listIdUser }
  }).select("fullName avatar statusOnline").lean();

  for (let user of users) {
    const room = listRoomChat.find(
      (item: any) => item.user_id.toString() === user._id.toString()
    );
    if (room) {
      user.room_chat_id = room.room_id;
    }
  }
  return users;
}

export default getRoomUser; 