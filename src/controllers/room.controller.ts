import { Response, Request } from 'express';
import User from '../models/user.model';
import Room from '../models/room.model';

// [get] /chat/create
export const create = async (req: Request, res: Response) => {

  const listFriend = res.locals.user.friendList;
  const friendIds: string[] = listFriend.map((item: any) => item.user_id);

  const friends = await User.find({
    _id: { $in: friendIds }
  }).select("fullName avatar");

  res.render("pages/room/create", {
    title: "Tạo mới phòng",
    friends: friends
  });
}

// [post] /chat/create
export const createPost = async (req: Request, res: Response) => {
  const userLogined = res.locals.user.id;
  const { title, memberIds } = req.body;

  if (!memberIds) {
    return res.redirect("/room/create");
  }


  let members: string[] = [];

  if (Array.isArray(memberIds)) {
    members = memberIds;
  } else {
    members = [memberIds];
  }

  if (members.length == 1) {
    const userId = members;
    const existRoom = await Room.findOne({
      typeRoom: "single",
      "members": {
        $all: [
          { $elemMatch: { user_id: userLogined } },
          { $elemMatch: { user_id: userId } }
        ]
      }
    });
    console.log(existRoom);
    if (existRoom) {
      return res.redirect(`/chat?roomId=${existRoom.id}`);
    }
  }

  const newRoomData: any = {
    title: title,
    members: [
      {
        user_id: userLogined,
        role: "superAdmin",
        status: "accepted"
      }
    ]
  };

  members.forEach((memberId) => {
    newRoomData.members.push({
      user_id: memberId,
      role: "member",
      status: "accepted"
    });
  });

  const newRoom = new Room(newRoomData);
  await newRoom.save();
  res.redirect(`/chat?roomId=${newRoom.id}`);
  res.send("ok");
}