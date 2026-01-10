import z from "zod";

export const nameUpdateSchema = z.object({
  name: z.string().min(1, "name is required").max(50, "name is too long"),
});
