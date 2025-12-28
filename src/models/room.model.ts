import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "",
  },
  typeRoom: {
    type: String,
    enum: ["single", "group"],
  },
  members: [
    {
      user_id: String,
      role: {
        type: String,
        enum: ["superAdmin", "admin", "member"],
        default: "member",

      },
      status: {
        type: String,
        enum: ["waiting", "accepted", "refused"]
      }
    }
  ],
  deleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
})

const Room = mongoose.model("Room", userSchema, "rooms");

export default Room; 