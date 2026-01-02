import type z from "zod";
import type { registerSchema } from "../schema/auth";

export type registerFormInputs = z.infer<typeof registerSchema>;
