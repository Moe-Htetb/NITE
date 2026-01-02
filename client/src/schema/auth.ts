import z from "zod";

export const registerSchema = z.object({
  email: z.email({ message: "Please enter a valid email." }),
});
