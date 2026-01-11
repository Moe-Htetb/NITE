import z from "zod";

export const nameUpdateSchema = z.object({
  name: z.string().min(1, "name is required").max(50, "name is too long"),
});
export const emailUpdateSchema = z.object({
  email: z.email("Please provide a valid email address"),
});
