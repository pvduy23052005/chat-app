import { Request, Response } from "express";
import User from "../models/user.model";
import md5 from "md5";
import { Socket } from "socket.io";

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
      console.log("chat vao day ")
      return res.redirect("/auth/login");
    }
    if (user.password != md5(password)) {
      req.flash("error", "Mật khẩu không chính xác");
      return res.redirect("/auth/login");
    }

    res.cookie("token", user.token);

    await User.updateOne({
      token: user.token
    }, {
      statusOnline: "online"
    });

    _io.once("connection", (socket: Socket) => {
      socket.broadcast.emit("SERVER_USER_ONLINE", {
        userId: user.id,
        status: "online",
      });
    });
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
      statusOffline: "offline"
    };

    const newUser = new User(userObject);
    newUser.save();
    res.cookie("token", newUser.token);

    req.flash("success", "Vui lòng đăng nhập");
    res.redirect("/auth/login");
  } catch (error) {
    console.log(error);
  }
}

export const logout = async (req: Request, res: Response) => {
  try {
    await User.updateOne({
      token: req.cookies.token,
    }, {
      statusOnline: "offline"
    });

    const user: any = await User.findOne({
      token: req.cookies.token,
      deleted: false
    }).select("fullName");

    if (user) {
      _io.emit("SERVER_USER_ONLINE", {
        userId: user.id,
        status: "offline",
      });
    }

    res.clearCookie("token");
    res.redirect("/auth/login");
  } catch (error) {
    console.log(error);
  }
}

