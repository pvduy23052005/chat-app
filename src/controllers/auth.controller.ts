import { Request, Response } from "express";
import User from "../models/user.model";
import md5 from "md5";

// [get] /auth/login . 
export const login = async (req: Request, res: Response) => {
  res.render("pages/auth/login");
}

// [get] /auth/register . 
export const register = async (req: Request, res: Response) => {
  res.render("pages/auth/register");
}

// [post] /auth/register . 
export const registerPost = async (req: Request, res: Response) => {
  let { email, password, fullName, passwordConfirm } = req.body;
  try {
    const user = await User.findOne({
      email: email,
    });

    if (user) {
      req.flash("error", "Email đã tồn tại");
      res.redirect("/auth/register");
      return;
    }
    if (password != passwordConfirm) {
      req.flash("error", "Xác nhận mật khẩu không đúng");
      res.redirect("/auth/register");
      return;
    }

    password = md5(password);
    const userObject = {
      fullName: fullName,
      email: email,
      password: password,
    };

    const newUser = new User(userObject);
    newUser.save();
    res.cookie("token", newUser.token);

    req.flash("success" , "Đăng ký thành cồng");
    res.redirect("/auth/login");
  } catch (error) {
    console.log(error);
  }
}

