import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/user.model";
import { asyncHandler } from "../utils/asyncHandler";

interface User {
  name: string;
  email: string;
  _id: string;
  role: "customer" | "admin";
}
export interface AuthRequest extends Request {
  user?: User;
}
export const protect = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token = req.cookies.token;
    if (!token) {
      res.status(401);
      throw new Error("Not authorized");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    if (!decoded) {
      res.status(401);
      throw new Error("Not authorized.Token is invalid");
    }
    const user = (await User.findById(decoded.userId).select(
      "-password"
    )) as User;
    if (!user) {
      res.status(401);
      throw new Error("Not authorized");
    }
    req.user = user;
    next();
  }
);

export const isAdmin = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== "admin") {
      res.status(401);
      throw new Error("Not authorized");
    }
    next();
  }
);
