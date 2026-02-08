import { z } from "zod";

export const productFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  price: z
    .string()
    .min(1, "Price is required")
    .regex(/^\d+(\.\d+)?$/, "Must be a valid number"),

  instock_count: z.string().default("0"),
  rating_count: z.string().default("0"),

  is_feature: z.boolean().default(false),
  is_new_arrival: z.boolean().default(false),

  sizes: z.array(z.string()).default([]),
  colors: z.array(z.string()).default([]),

  images: z.instanceof(FileList).optional(),
});
