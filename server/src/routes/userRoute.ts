import { Router } from "express";
import {
  loginController,
  logoutController,
  registerController,
} from "../controllers/user.controller";
import {
  loginValidation,
  registerValidation,
} from "../validators/userValidadator";
import { validateRequest } from "../middlewares/validateRequest";

const userRouter = Router();

userRouter.post(
  "/register",
  registerValidation,
  validateRequest,
  registerController
);
userRouter.post("/login", loginValidation, validateRequest, loginController);
userRouter.post("/logout", logoutController);
export default userRouter;
