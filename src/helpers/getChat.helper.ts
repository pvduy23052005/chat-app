import Chat from "../models/chat.model";

const getChat = async (roomId: string) => {
  const chats = await Chat.find({
    room_id: roomId,
    deleted: false
  })
    .sort({ createdAt: 1 })
    .populate({
      path: "user_id",
      select: "fullName avatar"
    });

  return chats;
}

export default getChat;