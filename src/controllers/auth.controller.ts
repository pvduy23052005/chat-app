import { Request, Response } from "express";
import User from "../models/user.model";
import md5 from "md5";

// [get] /auth/login . 
export const login = async (req: Request, res: Response) => {
  res.render("pages/auth/login");
}

// [post] /auth/login . 
export const loginPost = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({
      email: email,
    });

    if (!email || !password) {
      req.flash("error", "Vui lòng điền đầy đủ thông tin");
      return res.redirect("/user/login");
    }
    if (!user) {
      req.flash("error", "Email không chính xác");
      return res.redirect("/user/login");
    }
    if (user.password != md5(password)) {
      req.flash("error", "Password không chính xác");
      return res.redirect("/user/login");
    }

    res.cookie("token", user.token);
    res.redirect("/chat");
  } catch (error) {
    console.log(error);
  }
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

    req.flash("success", "Đăng ký thành cồng");
    res.redirect("/auth/login");
  } catch (error) {
    console.log(error);
  }
}

export const logout = (req: Request, res: Response) => {
  try {
    res.clearCookie("token");
    res.redirect("/auth/login");
  } catch (error) {

  }
}

