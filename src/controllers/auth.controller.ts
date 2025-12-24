import { Request, Response } from "express";

// [get] /auth/login . 
export const login = async (req: Request, res: Response) => {
  res.render("pages/auth/login");
}

// [get] /auth/register . 
export const register = async (req: Request, res: Response) => {
  res.render("pages/auth/register");
}