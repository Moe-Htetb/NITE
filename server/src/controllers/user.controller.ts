import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { User } from "../models/user.model";
import { generateToken } from "../utils/generateToken";
import { AuthRequest } from "../middlewares/authMiddleware";
import { deleteImage, uploadSingeImage } from "../cloud/cloudinary";
import bcrypt from "bcryptjs";
import { otpEmailTemplate } from "../utils/emailTemplate";
import { sendEmail } from "../utils/sentEmail";

import { generateOneTimeToken, generateOTP } from "../utils/generateOTP";
import { Otp } from "../models/otp.model";
import { Schema } from "mongoose";
import { checkOtpLimit } from "../utils/checkOtpLimit";
import moment from "moment";
//@route POST | /api/v1/register
// @desc Register new user
// @access Public
export const registerController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const token = generateOneTimeToken();
    // const otp = generateOTP(); // for production
    const otp = "123456";
    const hashOtp = await bcrypt.hash(otp, 10);

    // Send verification email for registration
    const verificationUrl = `${process.env.CLIENT_URL}/verify-otp`;
    const emailBody = otpEmailTemplate(otp, verificationUrl);

    const existEmail = await Otp.findOne({ email });

    let data;
    if (!existEmail) {
      const otpData = {
        email,
        otp: hashOtp,
        token,
        count: 1,
        errorCount: 0,
      };
      data = await Otp.create(otpData);
    } else {
      const lastOtpRequest = new Date(
        existEmail.updatedAt as unknown as string | number | Date
      ).toLocaleDateString();
      const currentDate = new Date().toLocaleDateString();
      const isSameDate = lastOtpRequest === currentDate;

      checkOtpLimit(isSameDate, existEmail?.errorCount, existEmail?.count);

      const otpData = {
        otp: hashOtp,
        token,
        count: isSameDate ? existEmail.count + 1 : 1,
        errorCount: 0,
      };
      data = await Otp.findByIdAndUpdate(existEmail._id, otpData, {
        new: true,
      });
    }

    // Send email with OTP
    try {
      // await sendEmail({
      //   reciver_mail: email,
      //   subject: "Verify Your Email - NITE.COM",
      //   body: emailBody,
      // });

      res.status(200).json({
        message: `We are sending OTP to ${email}`,
        token,
        // Don't send user data for security
      });
    } catch (error) {
      if (existEmail) {
        await Otp.findByIdAndUpdate(existEmail._id, {
          $inc: { count: -1 }, // Decrement count by 1
        });
      }
      throw new Error("Failed to send verification email. Please try again.");
    }
  }
);
// @route POST | api/verify-register-otp
// desc Verify OTP for registration
// @access Public
export const verifyRegisterOtpController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp, token, name, password } = req.body;

    // Check if OTP record exists
    const otpRow = await Otp.findOne({ email });
    // console.log(otpRow);
    if (!otpRow) {
      res.status(400).json({
        error: "OTP not found",
        message: "Please request a new OTP",
      });
      return;
    }

    // Check if user already exists (prevent duplicate registration)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        error: "User already exists",
        message: "This email is already registered",
      });
      return;
    }

    // Check if OTP is from same date
    const isSameDate =
      new Date(
        otpRow.updatedAt as unknown as string | number | Date
      ).toLocaleDateString() === new Date().toLocaleDateString();

    // Check error count limit
    if (otpRow.errorCount >= 5) {
      res.status(403).json({
        error: "Too many failed attempts",
        message: "Please try again tomorrow",
      });
      return;
    }

    // Token verification
    const isSameToken = otpRow.token === token;
    if (!isSameToken) {
      await Otp.findByIdAndUpdate(
        otpRow._id,
        {
          errorCount: 5,
        },
        { new: true }
      );
      res.status(400).json({
        error: "Invalid token",
        message: "Token verification failed",
      });
      return;
    }

    // OTP expiration check (1 minutes for registration)
    const isOtpExpired =
      moment().diff(
        moment(otpRow.updatedAt as unknown as string | number | Date),
        "minutes"
      ) > 1;
    if (isOtpExpired) {
      res.status(403).json({
        error: "OTP expired",
        message: "Please request a new OTP",
      });
      return;
    }

    // OTP verification
    const isMatchOtp = await bcrypt.compare(otp, otpRow.otp);
    // console.log(isMatchOtp);
    if (!isMatchOtp) {
      const newErrorCount = isSameDate ? otpRow.errorCount + 1 : 1;
      await Otp.findByIdAndUpdate(
        otpRow._id,
        {
          errorCount: newErrorCount,
        },
        { new: true }
      );

      res.status(400).json({
        error: "Invalid OTP",
        message: "Please check your OTP and try again",
      });
      return;
    }

    // OTP verified successfully - Create user account
    const user = await User.create({
      name,
      email,
      password,
    });

    // Generate auth token
    const loginToken = generateToken(res, user._id);

    res.status(201).json({
      message: "Account created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: loginToken,
    });
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

      const LoginToken = generateToken(res, user._id);
      res.status(200).json({
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token: LoginToken,
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

//@route POST | /api/v1/profileUpload
// @desc login user upload image
// @access Private

export const profileUploadController = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    const imageUrl = req.body.imageUrl;
    const userInfo = await User.findById(user?._id);

    if (userInfo?.profile?.url)
      await deleteImage(userInfo?.profile?.public_alt);

    const response = await uploadSingeImage(imageUrl, "NITE/user/profile");
    await User.findByIdAndUpdate(userInfo?._id, {
      profile: {
        url: response.url,
        public_alt: response.public_alt,
      },
    });

    // console.log(response);
    res.status(200).json({ message: "Avatar Uploaded.", url: response.url });
  }
);

//@route POST | /api/v1/profile
// @desc login user getting profile
// @access Private

export const getUserProfileController = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    const userInfo = await User.findById(user?._id).select("-password");
    res.status(200).json({ user: userInfo });
  }
);

//@route POST | /api/v1/updateEmail
// @desc login user update email
// @access Private
export const updateEmailController = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { user } = req;
    const { email } = req.body;

    const existUserEmail = await User.findOne({ email });
    if (existUserEmail) {
      throw new Error("This email is already owned by other");
    }
    await User.findByIdAndUpdate(user?._id, { email });
    res.status(200).json({ message: "Email Updated Successfully" });
  }
);

//@route POST | /api/v1/updateName
// @desc login user update name
// @access Private
export const updateNameController = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { user } = req;
    const { name } = req.body;

    await User.findByIdAndUpdate(user?._id, { name });
    res.status(200).json({ message: "Name Updated Successfully" });
  }
);

//@route POST | /api/v1/updateName
// @desc login user update name
// @access Private
export const updatePasswordController = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { user } = req;
    const { old_password, new_password } = req.body;

    const existUser = await User.findById(user?._id).select("+password");

    if (!existUser) throw new Error("Not Authorized");

    const isPasswordValid = await bcrypt.compare(
      old_password,
      existUser.password
    );
    if (!isPasswordValid) throw new Error("Password Invalid");
    existUser.password = new_password;
    await existUser.save();

    res.status(200).json({ message: "Password updated successfully." });
  }
);

// @route POST | api/forgot-password
// desc Send email to user's own mail.
// @access Private
export const forgotPasswordController = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { email } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new Error("This email doesn't exist.");
    }

    const token = generateOneTimeToken();
    const resetPasswordUrl = `${process.env.CLIENT_URL}/reset-password`;
    // const otp = generateOTP(); // for production
    const otp = "123456";
    const hashOtp = await bcrypt.hash(otp, 10); // Hash the OTP

    const body = otpEmailTemplate(otp, resetPasswordUrl);

    const existEmail = await Otp.findOne({ email });

    let data;
    if (!existEmail) {
      // Create new OTP record with HASHED OTP
      const otpData = {
        email,
        otp: hashOtp, // Store hashed OTP
        token,
        count: 1,
        errorCount: 0,
      };
      data = await Otp.create(otpData);
    } else {
      // Check if OTP was requested on the same day
      const lastOtpRequest = new Date(
        existEmail.updatedAt as unknown as string | number | Date
      ).toLocaleDateString();
      const currentDate = new Date().toLocaleDateString();
      const isSameDate = lastOtpRequest === currentDate;

      checkOtpLimit(isSameDate, existEmail?.errorCount, existEmail?.count);

      // Always use HASHED OTP
      const otpData = {
        otp: hashOtp, // Store hashed OTP here too
        token,
        count: isSameDate ? existEmail.count + 1 : 1,
        errorCount: 0, // Reset error count on new OTP request
      };
      data = await Otp.findByIdAndUpdate(existEmail._id, otpData, {
        new: true,
      });
    }

    // Send email with OTP (uncomment when ready)
    // try {
    //   await sendEmail({
    //     reciver_mail: email,
    //     subject: "Password Reset - NITE.COM",
    //     body,
    //   });
    // } catch (error) {
    //   // If email sending fails, decrement the count since OTP wasn't actually sent
    //   if (existEmail) {
    //     await Otp.findByIdAndUpdate(existEmail._id, {
    //       $inc: { count: -1 }, // Decrement count by 1
    //     });
    //   }
    //   throw new Error("OTP send error");
    // }

    res.status(200).json({
      message: `We are sending OTP to ${email}`,
      token,
    });
  }
);

// @route POST | api/verify-otp
// desc verify Otp
// @access Private
export const verifyOtpController = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { email, otp, token } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({
        error: "User not found",
        message: "Invalid email",
      });
      return;
    }

    // Check if OTP record exists
    const otpRow = await Otp.findOne({ email });
    if (!otpRow) {
      res.status(400).json({
        error: "OTP not found",
        message: "Please request a new OTP",
      });
      return;
    }

    // Check if OTP is from same date
    const isSameDate =
      new Date(
        otpRow.updatedAt as unknown as string | number | Date
      ).toLocaleDateString() === new Date().toLocaleDateString();

    // Check error count limit
    if (otpRow.errorCount >= 5) {
      res.status(403).json({
        error: "Too many failed attempts",
        message: "Please try again tomorrow",
      });
      return;
    }

    // Token verification
    const isSameToken = otpRow.token === token;
    if (!isSameToken) {
      // Update error count to maximum
      await Otp.findByIdAndUpdate(
        otpRow._id,
        {
          errorCount: 5,
        },
        { new: true }
      );
      res.status(400).json({
        error: "Invalid token",
        message: "Token verification failed",
      });
      return;
    }

    // OTP expiration check (5 minutes)
    const isOtpExpired =
      moment().diff(
        moment(otpRow.updatedAt as unknown as string | number | Date),
        "minutes"
      ) > 1;
    if (isOtpExpired) {
      res.status(403).json({
        error: "OTP expired",
        message: "Please request a new OTP",
      });
      return;
    }

    // OTP verification
    const isMatchOtp = await bcrypt.compare(otp, otpRow.otp);
    if (!isMatchOtp) {
      // Increment error count
      const newErrorCount = isSameDate ? otpRow.errorCount + 1 : 1;
      await Otp.findByIdAndUpdate(
        otpRow._id,
        {
          errorCount: newErrorCount,
        },
        { new: true }
      );

      res.status(400).json({
        error: "Invalid OTP",
        message: "Please check your OTP and try again",
      });
      return;
    }

    const newToken = generateOneTimeToken();
    const otpData = {
      token: newToken,
      errorCount: 0, // Reset error count but keep the OTP and count
    };
    await Otp.findByIdAndUpdate(otpRow._id, otpData, { new: true });
    res
      .status(200)
      .json({ message: "OTP verified successfully", token: newToken });
  }
);
// @route POST | api/reset-password
// desc verify Otp
// @access Private
export const resetPasswordController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, new_password, token } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({
        error: "User not found",
        message: "Invalid email address",
      });
      return;
    }

    // Find OTP record
    const otpRow = await Otp.findOne({ email });
    if (!otpRow) {
      res.status(400).json({
        error: "Invalid request",
        message: "Please start the password reset process again",
      });
      return;
    }

    // OTP error count is over limit
    if (otpRow.errorCount >= 5) {
      res.status(400).json({
        error: "This request may be an attack",
        message: "Security violation detected",
      });
      return;
    }

    // Token is wrong
    if (otpRow.token !== token) {
      // Update error count to maximum
      await Otp.findByIdAndUpdate(otpRow._id, {
        errorCount: 5,
      });

      res.status(400).json({
        error: "Invalid token",
        message: "Token verification failed",
      });
      return;
    }

    // Request is expired (10 minutes)
    const isExpired =
      moment().diff(
        moment(otpRow.updatedAt as unknown as string | number | Date),
        "minutes"
      ) > 10;
    if (isExpired) {
      res.status(403).json({
        error: "Your request is expired",
        message: "Please try again",
      });
      return;
    }

    // Update user password (make sure to hash it!)
    // const hashedPassword = await bcrypt.hash(new_password, 10);
    user.password = new_password;
    await user.save();

    // Clear OTP record after successful password reset
    // await Otp.findByIdAndDelete(otpRow._id);

    res.status(200).json({
      message: "Password reset successfully",
      email: email,
    });
  }
);
