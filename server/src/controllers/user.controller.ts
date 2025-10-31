import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { User } from "../models/user.model";
import { generateToken } from "../utils/generateToken";

//@route POST | /api/v1/register
// @desc Register new user
// @access Public
export const registerController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, confirmPassword } = req.body;

    if (!name) throw new Error("Name is required");
    if (!email) throw new Error("Email is required");
    if (!password) throw new Error("Password is required");
    if (!confirmPassword) throw new Error("ConfirmPassword is required");

    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const user = await User.create({ name, email, password });

    if (user) {
      res.status(201).json({
        message: "Account Created Successfully",
        user: { id: user._id, name: user.name, email: user.email },
      });
    }
  }
);

//@route POST | /api/v1/login
// @desc user login
// @access Public
export const loginController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email) throw new Error("Email is required");
    if (!password) throw new Error("Password is required");

    const user = await User.findOne({ email });
    if (user && user.matchPassword(password)) {
      generateToken(res, user._id);
      res.status(200).json({
        message: "Login successful",
        user: { id: user._id, name: user.name, email: user.email },
      });
    } else {
      throw new Error("Invalid  Credentials");
    }
  }
);
export const logoutController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });
    res.status(200).json({ message: "Logout successful" });
  }
);
