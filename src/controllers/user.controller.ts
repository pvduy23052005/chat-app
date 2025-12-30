import { Request, Response } from "express";
import User from "../models/user.model";
import userSocket from "../socket/user.socket";


// [get] /user
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

// [get] /user/friend-accepts . 
export const friendAccepts = async (req: Request, res: Response) => {
  const userLogined: string = res.locals.user.id;
  const listIdFriendAccepts: string[] = res.locals.user.friendAccepts;

  userSocket(res);

  const users: any = await User.find({
    $and: [
      { _id: { $ne: userLogined } },

      { _id: { $in: listIdFriendAccepts } }],
    deleted: false
  }).select("fullName avatar");

  res.render("pages/user/friend-accept", {
    title: "Lời mời kết bạn",
    users: users
  })
}