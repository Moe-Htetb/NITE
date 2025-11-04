import { Router } from "express";
import {
  getUserProfileController,
  loginController,
  logoutController,
  profileUploadController,
  registerController,
  updateEmailController,
} from "../controllers/user.controller";
import {
  imageUploadValidation,
  loginValidation,
  registerValidation,
  updateEmailValidation,
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
userRouter.post(
  "/updateEmail",
  updateEmailValidation,
  validateRequest,
  protect,
  updateEmailController
);

export default userRouter;
