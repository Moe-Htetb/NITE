import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";

export const registerController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {}
);
export const loginController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {}
);
export const logoutController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {}
);
