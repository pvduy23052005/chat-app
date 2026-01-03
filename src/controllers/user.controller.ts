import { Request, Response } from "express";
import User from "../models/user.model";

// [get] /user
export const index = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;
    const userLogined: String = user.id;
    const friendIds: string[] = user.friendList.map((item: any) => item.user_id);
    const acceptIds: string[] = user.friendAccepts.map((item: any) => item.user_id);
    const listId = [
      userLogined,
      ...friendIds,
      ...acceptIds
    ];
    const keySearch = (req.query.keyword as string) || "";
    const regex = new RegExp(keySearch, "i");

    const users: any = await User.find({
      _id: { $nin: listId },
      deleted: false,
      fullName: regex
    }).select("fullName avatar");

    res.render("pages/user/index", {
      title: "Danh sách người dùng",
      users: users
    });

  } catch (error) {
    console.log(error);
  }
}

// [get] /user/friend-accepts . 
export const friendAccepts = async (req: Request, res: Response) => {
  const userLogined: string = res.locals.user.id;
  const listIdFriendAccepts: string[] = res.locals.user.friendAccepts;

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