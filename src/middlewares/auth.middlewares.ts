import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import jwt from 'jsonwebtoken';

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token: string | undefined = req.cookies?.token;

    if (!token) {
      req.flash("error", "Vui lòng thử lại");
      return res.redirect("/auth/login");
    }

    const data = (jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string)) as { userId: string }

    const user = await User.findOne({
      _id: data.userId,
      deleted: false,
    }).select("-password");
    if (!user) {
      req.flash("error", "Vui lòng thử lại");
      return res.redirect("/auth/login");
    }
    res.locals.user = user;
    next();
  } catch (error) {
    console.error(error);
    req.flash("error", "Có lỗi xảy ra, vui lòng đăng nhập lại");
    return res.redirect("/auth/login");
  }
};

export default authMiddleware;
