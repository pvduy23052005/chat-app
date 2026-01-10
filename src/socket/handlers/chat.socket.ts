import { Server, Socket } from "socket.io";
import Chat from "../../models/chat.model";
import { uploadCloud } from "../../helpers/uploadCloud";
import Room from "../../models/room.model";

const chatSocket = async (io: Server, socket: Socket) => {
  const userLogined = socket.data.user.id;
  const fullName = socket.data.user.fullName;

  try {
    const rooms = await Room.find({
      "members.user_id": userLogined,
      deleted: false
    });

    for (const room of rooms) {
      socket.join(room.id);
    }
  } catch (error) {
    console.error(error);
  }

  // server on event .
  socket.on("CLIENT_SEND_MESSAGE", async (data) => {
    // file [ image , pdf , doc ] ;
    const files = data.images;
    const roomId = data.roomId;
    let fileUrls: string[] = [];

    if (files && files.length > 0) {
      fileUrls = await uploadCloud(files);
    }

    const newChat = new Chat({
      user_id: userLogined,
      content: data.message,
      images: fileUrls,
      room_id: roomId
    });
    await newChat.save();

    await Room.updateOne({
      _id: roomId
    }, {
      lastMessageId: newChat.id,
      updatedAt: new Date(),
    });

    // server emit event . 
    io.to(roomId).emit("SERVER_SEND_MESSAGE", {
      user_id: userLogined,
      fullName: fullName,
      content: data.message,
      fileUrls: fileUrls,
      room_id: roomId
    })
  });

  socket.on("CLIENT_SEND_TYPING", (data) => {
    socket.broadcast.to(data.roomId).emit("SERVER_SEND_TYPING", {
      user_id: userLogined,
      fullName: fullName,
      type: data.type,
      room_id: data.roomId
    })
  });
}

export default chatSocket;