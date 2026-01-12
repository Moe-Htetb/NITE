import z from "zod";

export const nameUpdateSchema = z.object({
  name: z.string().min(1, "name is required").max(50, "name is too long"),
});
export const emailUpdateSchema = z.object({
  email: z.email("Please provide a valid email address"),
});
export const verifyEmailSchema = z.object({
  email: z.email("Please provide a valid email address"),
  otp: z.string().min(1, "otp is required").max(6, "otp is too long"),
  token: z.string().min(1, "token is required"),
});
export const emailUpdateOtpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});
