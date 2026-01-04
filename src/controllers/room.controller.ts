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

  if (!title) {
    req.flash("error", "Nhập tên phòng");
    return res.redirect("/room/create");
  }

  if (!memberIds) {
    req.flash("error", "Vui lòng chọn thành viên");
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
    if (existRoom) {
      return res.redirect(`/chat?roomId=${existRoom.id}`);
    }
  }

  const newRoomData: any = {
    title: title,
    typeRoom: "group",
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
  req.flash("success", "Tạo thành công");
  res.redirect(`/chat?roomId=${newRoom.id}`);
}

// [get] /chat/detail/:id ; 
export const detail = async (req: Request, res: Response) => {
  try {
    const roomId = req.params.id;
    const listFriend = res.locals.user.friendList;

    const room = await Room.findOne({
      _id: roomId,
      deleted: false
    }).populate({
      path: "members.user_id",
      select: "fullName avatar email"
    });

    if (!room) {
      return res.redirect("/chat");
    }

    const existMeberId = room.members.map((member: any) => member.user_id._id.toString());
    const friendIds: string[] = listFriend.map((item: any) => item.user_id);

    const friends = await User.find({
      $and: [
        { _id: { $in: friendIds } },
        { _id: { $nin: existMeberId } },
        { deleted: false }
      ]
    }).select("fullName avatar");


    res.render("pages/room/detail", {
      pageTitle: room.title,
      room: room,
      friends: friends,
    });

  } catch (error) {
    console.log(error);
    res.redirect("/chat");
  }
};

// [post] /chat/remove-member/  
export const removeMember = async (req: Request, res: Response) => {

  try {
    const { roomId, memberId } = req.body;
    const myId = res.locals.user.id;

    const existRoom: any = await Room.findOne({
      _id: roomId,
      deleted: false
    });

    if (!existRoom) {
      req.flash("error", "Phòng không tồn tại");
      return res.redirect("/chat");
    }

    const currentMember = existRoom.members.find(
      (member: any) => member.user_id.toString() === myId
    );

    if (currentMember.role !== "superAdmin") {
      req.flash("error", "Bạn không có quyền xóa thành viên");
      return res.redirect(`/room/${roomId}`);
    }

    if (memberId === myId) {
      req.flash("error", "Không thể xóa chính mình khỏi nhóm");
      return res.redirect(`/room/${roomId}`);
    }


    await Room.updateOne({
      _id: roomId
    }, {
      $pull: {
        members: { user_id: memberId }
      }
    });
    req.flash("success", "Đã xóa thành viên khỏi nhóm");
    res.redirect(`/room/detail/${roomId}`);
  } catch (error) {
    console.log(error);
  }
}

// [post] /chat/add-member/:id  
export const addMember = async (req: Request, res: Response) => {
  try {
    const roomId = req.params.id;
    let { memberIds } = req.body;

    const room = await Room.findOne({
      _id: roomId,
      deleted: false
    })

    if (!room) {
      return res.redirect(`/room/detail/${roomId}`);

    }

    if (!memberIds) {
      return res.redirect(`/room/detail/${roomId}`);

    }

    if (!Array.isArray(memberIds)) {
      memberIds = [memberIds];
    }

    const listNewMembers = memberIds.map((userId: string) => {
      return {
        user_id: userId,
        role: "member",
        status: "accepted"
      };
    });

    await Room.updateOne(
      {
        _id: roomId,
        deleted: false
      },
      {
        $push: {
          members: { $each: listNewMembers }
        }
      }
    );

    req.flash("success", "Thêm thành công");
    res.redirect(`/room/detail/${roomId}`);
  } catch (error) {
    console.log(error);

  }
}

// [post] /chat/delete/:id
export const deletePost = async (req: Request, res: Response) => {
  try {
    const roomId = req.params.id;
    const myId = res.locals.user.id;

    const room: any = await Room.findOne({
      _id: roomId,
      deleted: false
    });

    if (!room) {
      req.flash("error", "Phòng không tồn tại!");
      return res.redirect("/chat");
    }

    const myInfo = room.members.find(
      (member: any) => member.user_id.toString() === myId
    );

    if (!myInfo || myInfo.role !== "superAdmin") {
      req.flash("error", "Bạn không có quyền xóa phòng này!");
      return res.redirect("back");
    }

    await Room.updateOne(
      { _id: roomId },
      {
        deleted: true,
        deletedAt: new Date()
      }
    );

    req.flash("success", "Đã xóa phòng chat thành công!");
    res.redirect("/chat");

  } catch (error) {
    console.log(error);
    req.flash("error", "Lỗi xóa phòng!");
    res.redirect("/chat");
  }
};

// [post] /room/edit/:id
export const editPost = async (req: Request, res: Response) => {
  try {
    const roomId = req.params.id;
    const { title } = req.body;
    const myId = res.locals.user.id;

    if (!title) {
      req.flash("error", "Tiêu đề không được để trống");
      return res.redirect("back");
    }

    const room = await Room.findOne({ _id: roomId, deleted: false });
    if (!room) return res.redirect("/chat");

    const myInfo = room.members.find((member: any) => member.user_id.toString() == myId);
    if (!myInfo || myInfo.role !== "superAdmin") {
      req.flash("error", "Bạn không có quyền chỉnh sửa");
      return res.redirect("back");
    }

    // 3. Update DB
    await Room.updateOne(
      { _id: roomId },
      {
        title: title,
      }
    );

    req.flash("success", "Cập nhật thông tin thành công");
    res.redirect(`/room/detail/${roomId}`)
  } catch (error) {
    console.log(error);
  }
};

// [post] /room/leave/:id
export const leavePost = async (req: Request, res: Response) => {
  try {
    const roomId = (req.params.id as string);
    const myId = res.locals.user.id;

    const room: any = await Room.findOne({ _id: roomId, deleted: false });
    if (!room) return res.redirect("/chat");

    const myInfo = room.members.find(
      (member: any) => member.user_id.toString() === myId
    );

    if (myInfo && myInfo.role === "superAdmin") {
      req.flash("error", "Bạn là Trưởng nhóm duy nhất. Vui lòng chỉ định người khác làm Trưởng nhóm trước khi rời, hoặc xóa nhóm.");
      return res.redirect(`/chat/detail/${roomId}`);
    }

    await Room.updateOne(
      { _id: roomId },
      {
        $pull: {
          members: { user_id: myId }
        }
      }
    );
    res.redirect("/chat");
  } catch (error) {
    console.log(error);
  }
}