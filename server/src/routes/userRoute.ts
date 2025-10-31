import { Router } from "express";
import {
  loginController,
  logoutController,
  registerController,
} from "../controllers/user.controller";

const userRouter = Router();

userRouter.post("/register", registerController);
userRouter.post("/login", loginController);
userRouter.post("/logout", logoutController);
export default userRouter;
