import type z from "zod";
import type { otpSchema, registerSchema } from "../schema/auth";

export type registerFormInputs = z.infer<typeof registerSchema>;

export type otpFormInputs = z.infer<typeof otpSchema>;
