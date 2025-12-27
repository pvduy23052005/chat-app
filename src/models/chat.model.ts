import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  user_id: {
    type: String
  },
  room_id: {
    type: String
  },
  content: {
    type: String,
  },
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date
  }
}, {
  timestamps: true
})

const Chat = mongoose.model("Chat", chatSchema, "chats");

export default Chat; 