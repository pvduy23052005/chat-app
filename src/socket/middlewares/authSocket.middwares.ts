import { Socket } from "socket.io";
import User from "../../models/user.model";

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


    const user = await User.findOne({
      token: token,
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