import z from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must not exceed 50 characters")
      .trim(),

    email: z
      .email("Please provide a valid email address")
      .transform((email) => email.toLowerCase().trim()),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .refine((password) => /(?=.*[A-Z])/.test(password), {
        message: "Password must contain at least one uppercase letter",
      })
      .refine((password) => /(?=.*\d)/.test(password), {
        message: "Password must contain at least one number",
      })
      .refine(
        (password) =>
          /(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password),
        {
          message: "Password must contain at least one special character",
        }
      ),

    confirm_password: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

export const signInSchema = z.object({
  email: z
    .email("Please provide a valid email address")
    .transform((email) => email.toLowerCase().trim()),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

export const emailSchema = z.object({
  email: z.email("Please enter a valid email address"),
});
