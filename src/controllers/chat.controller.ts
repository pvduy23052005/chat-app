import { Request, Response } from "express";
import Chat from "../models/chat.model";
import User from "../models/user.model";
import getInfoRoom from "../helpers/getInfoRoom.helper";
import getRoomUser from "../helpers/getRoomUser.helper";
import getRoomGroup from "../helpers/getRoomGroup.helper";


// [get] /chat?roomId; 
export const index = async (req: Request, res: Response) => {
  try {
    const roomId = (req.query.roomId as string) || "";
    let chats: any[] = [];
    let infoRoom: any = null;
    let allRooms: any = [];
    const users = await getRoomUser(res, "accepted");
    const roomGroup = await getRoomGroup(res);

    allRooms = [
      ...users.map((item) => (
        {
          ...item,
        }
      )),
      ...roomGroup.map((item) => (
        {
          ...item
        }
      ))
    ];

    allRooms.sort((a: any, b: any) => {
      return b.updatedAt - a.updatedAt;
    });

    if (roomId) {
      chats = await Chat.find({
        room_id: roomId,
        deleted: false
      })
        .sort({ createdAt: 1 })
        .populate({
          path: "user_id",
          select: "fullName avatar"
        });

      const objectRoom = await getInfoRoom(req, res);
      if (objectRoom) {
        infoRoom = objectRoom;
      }
    }

    res.render("pages/chat/index", {
      title: "Chat-app",
      allRooms: allRooms,
      chats: chats,
      infoRoom: infoRoom,
      roomId: roomId,
    });
  } catch (error) {
    console.log(error);
  }
}

// [get] /chat/not-friend?roomId; 
export const chatNotFriend = async (req: Request, res: Response) => {
  try {
    const roomId = (req.query.roomId as string) || "";
    let chats: any[] = [];
    let infoRoom: any = null;
    const users = await getRoomUser(res, "waiting");

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
    }

    res.render("pages/chat/not-friend", {
      title: "Chat-app",
      users: users,
      chats: chats,
      infoRoom: infoRoom,
      roomId  : roomId
    });
  } catch (error) {
    console.log(error);
  }
}






