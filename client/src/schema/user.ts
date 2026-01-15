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
export const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
