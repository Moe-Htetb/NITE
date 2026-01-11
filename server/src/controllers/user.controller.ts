import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { User } from "../models/user.model";
import { generateToken } from "../utils/generateToken";
import { AuthRequest } from "../middlewares/authMiddleware";
import { deleteImage, uploadSingleImage } from "../cloud/cloudinary";
import bcrypt, { truncates } from "bcryptjs";
import { otpEmailTemplate } from "../utils/emailTemplate";
import { sendEmail } from "../utils/sentEmail";

import { generateOneTimeToken, generateOTP } from "../utils/generateOTP";
import { Otp } from "../models/otp.model";

import { checkOtpLimit } from "../utils/checkOtpLimit";
import moment from "moment";
import mongoose from "mongoose";
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
    const otp = generateOTP();
    const hashOtp = await bcrypt.hash(otp, 10);

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

    const verificationUrl = `${process.env.CLIENT_LOCAL_URL}/verify-otp`;
    const emailBody = otpEmailTemplate(otp, verificationUrl);

    try {
      console.log(`📧 Sending OTP email to: ${email}`);

      await sendEmail({
        reciver_mail: email,
        subject: "Verify Your Email - NITE.COM",
        body: emailBody,
      });

      res.status(200).json({
        success: true,
        message: `OTP sent successfully to ${email}`,
        token,
      });
    } catch (error: any) {
      if (data) {
        await Otp.findByIdAndDelete(data._id);
      } else if (existEmail) {
        await Otp.findByIdAndUpdate(existEmail._id, {
          $inc: { count: -1 },
        });
      }
      res.status(400);
      throw new Error("Failed to send OTP email. Please try again.");
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
      ) > 5;
    if (isOtpExpired) {
      res.status(403).json({
        error: "OTP expired",
        message: "OTP expired.Please request a new OTP",
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

    await User.create({
      name,
      email,
      password,
    });

    res.status(201);
    res.json({
      success: true,
      message: "Account created successfully",
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
      // console.log(user);

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
      let profileUrl = "";
      if (
        user.profile &&
        Array.isArray(user.profile) &&
        user.profile.length > 0
      ) {
        profileUrl = user.profile[0]?.url || "";
      }
      res.status(200).json({
        success: true,
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          profile: profileUrl,
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
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    res.status(200).json({ success: true, message: "Logout successful" });
  }
);

//@route POST | /api/v1/profileUpload
// @desc login user upload image
// @access Private

export const profileUploadController = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = req.user;

      // Check if file was uploaded
      if (!req.file) {
        res.status(400);
        throw new Error("No image file provided");
      }

      const userInfo = await User.findById(user?._id);

      if (!userInfo) {
        res.status(404);
        throw new Error("User not found");
      }

      // Delete old profile image if exists
      if (userInfo.profile) {
        // Check if profile is an object with public_alt property
        if (userInfo.profile.public_alt) {
          console.log(
            "Deleting old image with public_alt:",
            userInfo.profile.public_alt
          );
          await deleteImage(userInfo.profile.public_alt);
        }
        // Or if profile is an array (check your User model structure)
        else if (
          Array.isArray(userInfo.profile) &&
          userInfo.profile.length > 0
        ) {
          const firstProfile = userInfo.profile[0];
          if (firstProfile.public_alt) {
            console.log(
              "Deleting old image from array with public_alt:",
              firstProfile.public_alt
            );
            await deleteImage(firstProfile.public_alt);
          }
        }
      }

      // Convert buffer to base64 for Cloudinary
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = "data:" + req.file.mimetype + ";base64," + b64;

      // Upload to Cloudinary
      const response = await uploadSingleImage(dataURI, "NITE/user/profile");

      // Update user profile - ensure consistent structure
      const updatedUser = await User.findByIdAndUpdate(
        userInfo._id,
        {
          profile: {
            url: response.url,
            public_alt: response.public_alt, // Make sure this matches what Cloudinary returns
          },
        },
        { new: true }
      ).select("-password");

      // Get profile URL for response
      let profileUrl = "";
      let profilePublicAlt = "";

      if (updatedUser!.profile) {
        if (updatedUser!.profile.url) {
          profileUrl = updatedUser!.profile.url;
          profilePublicAlt = updatedUser!.profile.public_alt;
        }
        // Check if it's an array (old structure)
        else if (
          Array.isArray(updatedUser!.profile) &&
          updatedUser!.profile.length > 0
        ) {
          profileUrl = updatedUser!.profile[0]?.url || "";
          profilePublicAlt = updatedUser!.profile[0]?.public_alt || "";
        }
      }

      res.status(200).json({
        success: true,
        message: "Profile image uploaded successfully",
        user: {
          id: updatedUser!._id,
          name: updatedUser!.name,
          email: updatedUser!.email,
          profile: profileUrl,
          role: updatedUser!.role,
        },
      });
    } catch (error: any) {
      console.error("Profile upload error:", error);
      next(error);
    }
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
// @desc Send OTP to new email for verification
// @access Private
export const updateEmailController = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { user } = req;
    const { email: newEmail } = req.body;

    // Check if user is authenticated
    if (!user) {
      res.status(401);
      throw new Error("Not authenticated");
    }

    // Get current user info
    const currentUser = await User.findById(user._id);
    if (!currentUser) {
      res.status(404);
      throw new Error("User not found");
    }

    // Check if new email is same as current email
    if (currentUser.email === newEmail) {
      res.status(400);
      throw new Error("New email cannot be same as current email");
    }

    // Check if new email already exists
    const existingUserWithNewEmail = await User.findOne({ email: newEmail });
    if (existingUserWithNewEmail) {
      res.status(400);
      throw new Error("This email is already registered");
    }

    // Generate OTP and token
    const token = generateOneTimeToken();
    const otp = generateOTP();
    const hashOtp = await bcrypt.hash(otp, 10);

    // Check existing OTP record for the new email
    const existEmail = await Otp.findOne({ email: newEmail });

    let otpData;
    if (!existEmail) {
      // Create new OTP record
      otpData = {
        email: newEmail,
        otp: hashOtp,
        token,
        count: 1,
        errorCount: 0,
        userId: user._id, // Store current user ID for verification
        purpose: "email-update", // Add purpose field for clarity
      };
      await Otp.create(otpData);
    } else {
      // Check if OTP was requested on the same day
      const lastOtpRequest = new Date(
        existEmail.updatedAt as unknown as string | number | Date
      ).toLocaleDateString();
      const currentDate = new Date().toLocaleDateString();
      const isSameDate = lastOtpRequest === currentDate;

      checkOtpLimit(isSameDate, existEmail?.errorCount, existEmail?.count);

      // Update existing OTP record
      const updateData = {
        otp: hashOtp,
        token,
        count: isSameDate ? existEmail.count + 1 : 1,
        errorCount: 0, // Reset error count
        userId: user._id, // Update with current user ID
        purpose: "email-update",
      };
      await Otp.findByIdAndUpdate(existEmail._id, updateData, {
        new: true,
      });
    }

    // Prepare verification URL (for email template)
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email-update`;
    const emailBody = otpEmailTemplate(otp, verificationUrl);

    try {
      console.log(`📧 Sending email update OTP to: ${newEmail}`);

      // Send OTP to new email
      await sendEmail({
        reciver_mail: newEmail,
        subject: "Verify Your New Email - NITE.COM",
        body: emailBody,
      });

      // For development, show OTP in console
      if (process.env.NODE_ENV === "development") {
        console.log(`🔄 DEV MODE: Email update OTP for ${newEmail}: ${otp}`);
      }

      // Also send notification to old email
      const notificationBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Email Change Request</h2>
          <p>Hello ${currentUser.name},</p>
          <p>We've received a request to change your email address from <strong>${currentUser.email}</strong> to <strong>${newEmail}</strong>.</p>
          <p>An OTP has been sent to the new email address for verification.</p>
          <p>If you didn't request this change, please contact our support team immediately.</p>
          <br/>
          <p>Best regards,<br/>NITE Team</p>
        </div>
      `;

      await sendEmail({
        reciver_mail: currentUser.email,
        subject: "Email Change Request Notification - NITE.COM",
        body: notificationBody,
      });

      res.status(200).json({
        success: true,
        message: `OTP sent successfully to ${newEmail}`,
        token,
        email: newEmail,
        // Include OTP in development mode for testing
        ...(process.env.NODE_ENV === "development" && {
          devOtp: otp,
          devNote: "OTP shown only in development mode",
        }),
      });
    } catch (error: any) {
      console.error("❌ Email update OTP sending failed:", error.message);

      // Clean up OTP record if email failed
      if (otpData) {
        await Otp.findByIdAndDelete(otpData.userId);
      } else if (existEmail) {
        await Otp.findByIdAndUpdate(existEmail._id, {
          $inc: { count: -1 },
        });
      }

      // For development, still return OTP even if email fails
      if (process.env.NODE_ENV === "development") {
        res.status(200).json({
          success: false,
          message: `Email sending failed, but here's your OTP for testing: ${otp}`,
          token,
          otp: otp,
          email: newEmail,
          error: error.message,
          note: "Email service failed, but you can use this OTP for testing",
        });
      } else {
        throw new Error("Failed to send verification email. Please try again.");
      }
    }
  }
);

//@route POST | /api/v1/verify-update-email
// @desc Verify OTP for email update
// @access Private
export const updateEmailVerifyController = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { user } = req;
    const { email: newEmail, otp, token } = req.body;

    // Check if user is authenticated
    if (!user) {
      res.status(401);
      throw new Error("Not authenticated");
    }

    // Check if OTP record exists for the new email
    const otpRow = await Otp.findOne({
      email: newEmail,
      purpose: "email-update",
    });

    if (!otpRow) {
      res.status(400).json({
        error: "OTP not found",
        message: "Please request a new OTP",
      });
      return;
    }

    // Verify the user ID matches
    if (otpRow.userId!.toString() !== user._id.toString()) {
      res.status(403).json({
        error: "Unauthorized",
        message: "This OTP is not for your account",
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

    // OTP expiration check (5 minutes)
    const isOtpExpired =
      moment().diff(
        moment(otpRow.updatedAt as unknown as string | number | Date),
        "minutes"
      ) > 5;
    if (isOtpExpired) {
      res.status(403).json({
        error: "OTP expired",
        message: "OTP expired. Please request a new OTP",
      });
      return;
    }

    // OTP verification
    const isMatchOtp = await bcrypt.compare(otp, otpRow.otp);
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

    // Get current user
    const currentUser = await User.findById(user._id);
    if (!currentUser) {
      res.status(404);
      throw new Error("User not found");
    }

    const oldEmail = currentUser.email;

    // Update user email
    currentUser.email = newEmail;
    await currentUser.save();

    // Delete OTP record after successful verification
    await Otp.findByIdAndDelete(otpRow._id);

    // Generate new login token (optional, since email is part of auth info)
    // const newLoginToken = generateToken(res, currentUser._id);

    // Send success notification to new email
    const successBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Email Update Successful</h2>
        <p>Hello ${currentUser.name},</p>
        <p>Your email address has been successfully updated.</p>
        <p><strong>Old Email:</strong> ${oldEmail}</p>
        <p><strong>New Email:</strong> ${newEmail}</p>
        <p>All future communications will be sent to this new email address.</p>
        <br/>
        <p>If you didn't make this change, please contact our support team immediately.</p>
        <br/>
        <p>Best regards,<br/>NITE Team</p>
      </div>
    `;

    await sendEmail({
      reciver_mail: newEmail,
      subject: "Email Update Successful - NITE.COM",
      body: successBody,
    });

    res.status(200).json({
      success: true,
      message: "Email updated successfully",
      email: newEmail,
      // user: {
      //   id: currentUser._id,
      //   name: currentUser.name,
      //   email: newEmail,
      //   profile: currentUser.profile?.url || "",
      //   role: currentUser.role,
      // },
      // token: newLoginToken,
    });
  }
);
//@route POST | /api/v1/updateName
// @desc login user update name
// @access Private
export const updateNameController = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { user } = req;
    const { name } = req.body;

    const updatedUser = await User.findByIdAndUpdate(user?._id, { name });
    res.status(200).json({
      message: "Name Updated Successfully",
      name: updatedUser?.name,
    });
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
    const otp = generateOTP(); // Generate real OTP
    const hashOtp = await bcrypt.hash(otp, 10); // Hash the OTP

    // Use the new email template with centered OTP
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

    // Send email with OTP
    try {
      console.log(`📧 Sending password reset OTP to: ${email}`);

      await sendEmail({
        reciver_mail: email,
        subject: "Password Reset - NITE.COM",
        body,
      });

      console.log(`✅ Password reset email sent successfully to: ${email}`);

      // For development, still show OTP in console for testing
      if (process.env.NODE_ENV === "development") {
        console.log(`🔄 DEV MODE: Password reset OTP for ${email}: ${otp}`);
      }

      // Send response
      res.status(200).json({
        success: true,
        message: `Password reset OTP sent successfully to ${email}`,
        token,
        // Include OTP in development mode for testing convenience
        ...(process.env.NODE_ENV === "development" && {
          devOtp: otp,
          devNote:
            "Password reset OTP shown only in development mode. Check your email inbox for the actual OTP.",
        }),
      });
    } catch (error: any) {
      console.error("❌ Password reset email sending failed:", error.message);

      // Clean up OTP record if email failed
      if (data) {
        await Otp.findByIdAndDelete(data._id);
      } else if (existEmail) {
        await Otp.findByIdAndUpdate(existEmail._id, {
          $inc: { count: -1 },
        });
      }

      // For development, still return OTP even if email fails
      if (process.env.NODE_ENV === "development") {
        console.log(`⚠️ Email failed, but returning OTP for testing: ${otp}`);
        res.status(200).json({
          success: false,
          message: `Email sending failed, but here's your OTP for testing: ${otp}`,
          token,
          otp: otp,
          error: error.message,
          note: "Email service failed, but you can use this OTP for testing",
        });
      } else {
        throw new Error(
          "Failed to send password reset email. Please try again."
        );
      }
    }
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
