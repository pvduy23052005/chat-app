import Room from "../../models/room.model";
import { Socket, Server } from "socket.io";
import User from "../../models/user.model";

const userSocket = async (io: Server, socket: Socket) => {
  const myId: string = socket.data.user.id;

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
    try {
      // add userB to firnedRequest of userA 
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
    } catch (error) {
      console.log(error);
    }

  });
  // end friend request 

  // friend cancel 
  socket.on("CLIENT_FRIEND_CANCEL", async (data) => {
    try {
      // delete userB to firnedRequest of userA 
      await User.updateOne({
        _id: myId,
      }, {
        $pull: {
          friendRequests: data.userId
        }
      });
      //  delete userA to friendAccepts of userB . 
      await User.updateOne({
        _id: data.userId,
      }, {
        $pull: {
          friendAccepts: myId,
        }
      })
    } catch (error) {
      console.log(error);
    }
  });
  // end friend cancel 

  // refuse friend 
  socket.on("CLIENT_REFUSE_FRIEND", async (data) => {
    try {
      // delete userB to firnedRequest of userA 
      await User.updateOne({
        _id: myId,
      }, {
        $pull: {
          friendAccepts: data.userId
        }
      });
      //  delete userA to friendAccepts of userB . 
      await User.updateOne({
        _id: data.userId,
      }, {
        $pull: {
          requestFriends: myId,
        }
      });
      console.log("ok")
    } catch (error) {
      console.log(error);
    }
  });
  // end refuse friend 

  // accept friend . 
  socket.on("CLIENT_ACCEPT_FRIEND", async (data) => {
    try {
      let existRoom = await Room.findOne({
        typeRoom: "single",
        "members.user_id": {
          $all: [myId, data.userId],
        }
      });
      if (existRoom) {
        await Room.updateOne(
          { _id: existRoom.id },
          { $set: { "members.$[].status": "accepted" } }
        );
      } else {
        const newRoom = new Room({
          typeRoom: "single",
          members: [
            { user_id: myId, status: "accepted" },
            { user_id: data.userId, status: "accepted" }
          ]
        });
        existRoom = await newRoom.save();
      }
      await User.updateOne({
        _id: myId,
      }, {
        $addToSet: {
          friendList: {
            user_id: data.userId,
            room_chat_id: existRoom.id
          }
        },
        $pull: { friendAccepts: data.userId }
      });
      await User.updateOne({
        _id: data.userId,
      }, {
        $addToSet: {
          friendList: {
            user_id: myId,
            room_chat_id: existRoom.id
          }
        },
        $pull: { friendRequests: myId }
      });
      console.log("ok");
    } catch (error) {
      console.log(error);
    }
  });
  // end accept friend . 
}

export default userSocket; 