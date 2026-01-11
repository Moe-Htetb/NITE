import type z from "zod";
import type { otpSchema, registerSchema, signInSchema } from "../schema/auth";
import type { emailUpdateSchema, nameUpdateSchema } from "@/schema/user";

export type registerFormInputs = z.infer<typeof registerSchema>;

export type otpFormInputs = z.infer<typeof otpSchema>;

export type signInFormInputs = z.infer<typeof signInSchema>;
export type NameUpdateFormData = z.infer<typeof nameUpdateSchema>;
export type emailUpdateFormData = z.infer<typeof emailUpdateSchema>;
