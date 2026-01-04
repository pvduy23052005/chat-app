import { Request, Response } from "express";
import getInfoRoom from "../helpers/getInfoRoom.helper";
import getRoomUser from "../helpers/getRoomUser.helper";
import getRoomGroup from "../helpers/getRoomGroup.helper";
import getChat from "../helpers/getChat.helper";

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
      chats = await getChat(roomId);
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
      chats = await getChat(roomId);
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
      roomId: roomId
    });
  } catch (error) {
    console.log(error);
  }
}






