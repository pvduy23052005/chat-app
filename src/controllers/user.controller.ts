import { Request, Response } from "express";
import User from "../models/user.model";
import userSocket from "../socket/user.socket";

export const index = async (req: Request, res: Response) => {
  try {
    const userLogined: String = res.locals.user.id;
    const users = await User.find({
      _id: { $ne: userLogined },
      deleted: false
    });

    userSocket(res);

    res.render("pages/user/index", {
      title: "Danh sách người dùng",
      users: users
    });

  } catch (error) {

  }
}