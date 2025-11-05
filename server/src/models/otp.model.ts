import mongoose, { Date, Schema } from "mongoose";
import bcrypt from "bcryptjs";

import { Document } from "mongoose";

interface IOtp extends Document {
  email: string;
  otp: string;
  token: string;
  count: number;
  errorCount: number;
  createdAt: Date | string | number;
  updatedAt: Date | string | number;
  matchOtp(enterOtp: string): Promise<boolean>;
}
const otpSchema = new Schema<IOtp>(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
    token: { type: String, required: true },
    count: { type: Number, required: true, default: 0 },
    errorCount: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
  }
);

// otpSchema.pre("save", async function (next) {
//   if (!this.isModified("otp")) {
//     next();
//   }
//   const salt = await bcrypt.genSalt(10);
//   this.otp = await bcrypt.hash(this.otp, salt);

//   next();
// });

// otpSchema.methods.matchOtp = async function (enterOtp: string) {
//   return await bcrypt.compare(enterOtp, this.otp);
// };
export const Otp = mongoose.model("Otp", otpSchema);
