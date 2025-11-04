import { Router } from "express";
import {
  getUserProfileController,
  loginController,
  logoutController,
  profileUploadController,
  registerController,
  updateEmailController,
  updateNameController,
  updatePasswordController,
} from "../controllers/user.controller";
import {
  imageUploadValidation,
  loginValidation,
  registerValidation,
  updateEmailValidation,
  updateNameValidation,
  updatePasswordValidation,
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
userRouter.post(
  "/updateName",
  updateNameValidation,
  validateRequest,
  protect,
  updateNameController
);
userRouter.post(
  "/updatePassword",
  updatePasswordValidation,
  validateRequest,
  protect,
  updatePasswordController
);

export default userRouter;
