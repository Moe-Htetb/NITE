import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import { Response } from "express";

export const generateToken = (res: Response, userId: Types.ObjectId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 7 * 60 * 60 * 24 * 1000,
  });
  return token;
};
