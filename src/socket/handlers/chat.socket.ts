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
      console.log("chay qua day ")
    }
  } catch (error) {
    console.error(error);
  }

  // server on event .
  socket.on("CLIENT_SEND_MESSAGE", async (data) => {
    const images = data.images;
    const imageUrls = await uploadCloud(images);
    const roomId = data.roomId;

    const newChat = new Chat({
      user_id: userLogined,
      content: data.message,
      images: imageUrls,
      room_id: roomId
    });
    await newChat.save();

    await Room.updateOne({
      _id: roomId
    }, {
      lastMessage: data.message ? data.message : "Đã gửi một ảnh"
    });

    // server emit event . 
    io.to(roomId).emit("SERVER_SEND_MESSAGE", {
      user_id: userLogined,
      fullName: fullName,
      content: data.message,
      images: imageUrls,
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