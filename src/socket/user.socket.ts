import Room from "../models/room.model";
import { Response } from "express";
import { Socket } from "socket.io";

const userSocket = async (res: Response): Promise<void> => {
  const myId: string = res.locals.user.id;
  _io.once("connection", (socket: Socket) => {
    socket.on("CLIENT_SEND_CHAT", async (userId: string) => {
      // check exist room . 
      const existRoom = await Room.findOne({
        typeRoom: "single",
        "members.user_id": {
          $all: [myId, userId]
        }
      });
      if (existRoom) {
        socket.emit("SERVER_SEND_ROOM_ID", { roomId: existRoom.id });
      } else {
        const newRoom = new Room(
          {
            typeRoom: "single",
            members: [
              {
                user_id: myId,
                role: "member",
                status: "accepted",
              },
              {
                user_id: userId,
                role: "member",
                status: "waiting",
              }
            ]
          });
        await newRoom.save();
        console.log(newRoom);
        socket.emit("SERVER_SEND_ROOM_ID", { roomId: newRoom.id });
      }
    })
  })
}

export default userSocket; 