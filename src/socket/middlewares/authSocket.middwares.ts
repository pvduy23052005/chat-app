import { Socket } from "socket.io";
import User from "../../models/user.model";
import jwt from "jsonwebtoken";

const authSokcet = async (socket: Socket, next: any) => {
  try {
    const cookieString = socket.handshake.headers.cookie;

    if (!cookieString) {
      return next(new Error("error"));
    }

    const token = cookieString.split("; ")
      .find((item) => item.startsWith("token="))
      ?.split("=")[1];
    if (!token) {
      return next(new Error("error"));
    }

    const data = (jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string)) as { userId: string };

    const user = await User.findOne({
      _id: data.userId,
      deleted: false
    }).select("-password");
    
    if (!user) {
      return next(new Error("error"));
    }
    socket.data.user = user;

    next();
  } catch (error) {
    next(new Error(" error"));
  }
}

export default authSokcet;