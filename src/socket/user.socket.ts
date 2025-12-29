import Room from "../models/room.model";
import { Response } from "express";
import { Socket } from "socket.io";
import User from "../models/user.model";

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
        socket.emit("SERVER_SEND_ROOM_ID", { roomId: newRoom.id });

      }
    });

    // friend request . 
    socket.on("CIENT_FRIEND_REQUEST", async (data) => {
      // add userB to firnedRequest of userA 
      try {
        await User.updateOne({
          _id: myId,
        }, {
          $addToSet: {
            friendRequests: data.userId
          }
        });
        //  add userA to friendAccepts of userB . 
        await User.updateOne({
          _id: data.userId,
        }, {
          $addToSet: {
            friendAccepts: myId,
          }
        })
        console.log("ok");
      } catch (error) {
        console.log(error);
      }
      
    });
    // end friend request 
  })
}

export default userSocket; 