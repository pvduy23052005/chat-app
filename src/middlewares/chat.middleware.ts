import { NextFunction, Request, Response } from 'express';
import Room from "../models/room.model";

const chatMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const roomId = req.query.roomId as string;
  const myId: string = res.locals.user.id;

  if (!roomId) {
    next();
    return;
  }

  const existRoom: any = await Room.findOne({
    _id: roomId,
    deleted: false,
    "members.user_id": myId
  }).select("title");

  if (!existRoom) {
    return res.redirect("/user");
  }

  next();
}

export default chatMiddleware;