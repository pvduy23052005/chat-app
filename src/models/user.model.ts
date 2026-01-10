import mongoose from "mongoose";
import * as random from "../helpers/random";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: ""
  },
  friendRequests: {
    type: Array,
    default: []
  },
  friendAccepts: {
    type: Array,
    default: []

  },
  friendList: [
    {
      user_id: String,
      room_chat_id: {
        type: String,

      }
    }
  ],
  statusOnline: {
    type: String,
    enum: ["online", "offline"],
  },
  deleted: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true,
})

const User = mongoose.model("User", userSchema, "users");

export default User; 