import type z from "zod";
import type {
  emailSchema,
  otpSchema,
  registerSchema,
  resetPasswordSchema,
  signInSchema,
} from "../schema/auth";
import type {
  emailUpdateOtpSchema,
  emailUpdateSchema,
  nameUpdateSchema,
  passwordSchema,
  verifyEmailSchema,
} from "@/schema/user";
import type { productFormSchema } from "@/schema/product";

export type registerFormInputs = z.infer<typeof registerSchema>;

export type otpFormInputs = z.infer<typeof otpSchema>;

export type signInFormInputs = z.infer<typeof signInSchema>;
export type NameUpdateFormData = z.infer<typeof nameUpdateSchema>;
export type emailUpdateFormData = z.infer<typeof emailUpdateSchema>;
export type verifyEmailFormData = z.infer<typeof verifyEmailSchema>;
export type verifyEmailOtpFormData = z.infer<typeof emailUpdateOtpSchema>;
export type PasswordFormValues = z.infer<typeof passwordSchema>;

export type ForgotPasswordFormValues = z.infer<typeof emailSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
export type ProductFormValues = z.input<typeof productFormSchema>;
