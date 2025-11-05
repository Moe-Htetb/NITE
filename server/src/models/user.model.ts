import bcrypt from "bcryptjs";
import mongoose, { Schema } from "mongoose";
import crypto from "crypto";

interface IUser {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  profile?: {
    url: string;
    public_alt: string;
  };
  role: "user" | "admin";
  // resetPasswordToken: String | undefined;
  // resetPasswordExpire: String | undefined;
  matchPassword(enteredPassword: string): Promise<boolean>;
  // generatePasswordResetToken(): Promise<string>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      required: true,
      type: String,
    },
    email: {
      required: true,
      type: String,
      unique: true,
    },
    password: {
      required: true,
      type: String,
    },
    confirmPassword: {
      required: false,
      type: String,
    },
    profile: {
      type: [
        {
          url: String,
          public_alt: String,
        },
      ],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    // resetPasswordToken: String,
    // resetPasswordExpire: String,
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  this.confirmPassword = undefined;
  next();
});

userSchema.methods.matchPassword = async function (enterPassword: string) {
  return await bcrypt.compare(enterPassword, this.password);
};
// userSchema.methods.generatePasswordResetToken =
//   async function (): Promise<string> {
//     const token = crypto.randomBytes(20).toString("hex");

//     this.resetPasswordToken = crypto
//       .createHash("sha256")
//       .update(token)
//       .digest("hex");
//     this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

//     return token;
//   };
export const User = mongoose.model<IUser>("User", userSchema);
