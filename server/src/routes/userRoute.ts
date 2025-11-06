import { Router } from "express";
import {
  getUserProfileController,
  loginController,
  logoutController,
  profileUploadController,
  registerController,
  forgotPasswordController,
  updateEmailController,
  updateNameController,
  updatePasswordController,
  verifyOtpController,
  resetPasswordController,
  verifyRegisterOtpController,
} from "../controllers/user.controller";
import {
  imageUploadValidation,
  loginValidation,
  forgotPasswordValidator,
  registerValidation,
  updateEmailValidation,
  updateNameValidation,
  updatePasswordValidation,
  verifyOtpValidator,
  resetPasswordValidator,
  verifyRegisterOtpValidation,
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
userRouter.post(
  "/verify-register-otp",
  verifyRegisterOtpValidation,
  validateRequest,
  verifyRegisterOtpController
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
userRouter.post(
  "/forgot-password",
  forgotPasswordValidator,
  validateRequest,
  protect,
  forgotPasswordController
);
userRouter.post(
  "/verify-otp",
  verifyOtpValidator,
  validateRequest,
  protect,
  verifyOtpController
);
userRouter.post(
  "/reset-password",
  resetPasswordValidator,
  validateRequest,
  protect,
  resetPasswordController
);
export default userRouter;
