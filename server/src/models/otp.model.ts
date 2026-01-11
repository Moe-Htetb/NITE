// models/otp.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IOtp extends Document {
  email: string;
  otp: string;
  token: string;
  count: number;
  errorCount: number;
  userId?: mongoose.Types.ObjectId;
  purpose?: string; // Add this: 'registration', 'password-reset', 'email-update'
  createdAt: Date;
  updatedAt: Date;
}

const otpSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    otp: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      default: 1,
    },
    errorCount: {
      type: Number,
      default: 0,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    purpose: {
      type: String,
      enum: ["registration", "password-reset", "email-update"],
      default: "registration",
    },
  },
  {
    timestamps: true,
  }
);

export const Otp = mongoose.model<IOtp>("Otp", otpSchema);
