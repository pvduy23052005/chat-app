import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";

const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token: String = req.cookies.token;

  if (!token) {
    req.flash("error", "Vui lòng đăng nhập lại ")
    return res.redirect("/auth/login");
  }

  const user = await User.findOne({
    token: token
  }).select("-password");

  if (!user) {
    req.flash("error", "Vui lòng đăng nhập lại")
    return res.redirect("/auth/login");
  }

  res.locals.user = user;

  next();
}

export default authMiddleware;

