import { Router } from "express";
import {
  getUserProfileController,
  loginController,
  logoutController,
  profileUploadController,
  registerController,
} from "../controllers/user.controller";
import {
  imageUploadValidation,
  loginValidation,
  registerValidation,
} from "../validators/userValidadator";
import { validateRequest } from "../middlewares/validateRequest";
import { protect } from "../middlewares/authMiddleware";

const userRouter = Router();

// auth
userRouter.post(
  "/register",
  registerValidation,
  validateRequest,
  registerController
);
userRouter.post("/login", loginValidation, validateRequest, loginController);
userRouter.post("/logout", logoutController);

//profile route
userRouter.post(
  "/profileUpload",
  imageUploadValidation,
  validateRequest,
  protect,
  profileUploadController
);
userRouter.get("/profile", protect, getUserProfileController);

export default userRouter;
