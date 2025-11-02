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
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        res.status(401);
        throw new Error("Invalid credentials");
      }

      const isPasswordValid = await user.matchPassword(password);

      if (!isPasswordValid) {
        res.status(401);
        throw new Error("Invalid credentials");
      }

      generateToken(res, user._id);
      res.status(200).json({
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

//@route POST | /api/v1/logout
// @desc user logout remove cookie
// @access Public
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
