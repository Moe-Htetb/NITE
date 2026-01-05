import type z from "zod";
import type { otpSchema, registerSchema, signInSchema } from "../schema/auth";

export type registerFormInputs = z.infer<typeof registerSchema>;

export type otpFormInputs = z.infer<typeof otpSchema>;

export type signInFormInputs = z.infer<typeof signInSchema>;
