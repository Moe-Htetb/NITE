import bcrypt from "bcryptjs";
import mongoose, { Schema } from "mongoose";

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  role: "user" | "admin";
  matchPassword(enteredPassword: string): Promise<boolean>;
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
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
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

export const User = mongoose.model<IUser>("User", userSchema);
