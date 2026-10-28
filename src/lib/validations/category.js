import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Category name must be at least 2 characters")
    .max(50, "Category name must not exceed 50 characters"),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(2, "Slug must be at least 2 characters")
    .max(50, "Slug must not exceed 50 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers, and hyphens (e.g. summer-wear)",
    ),
  display_order: z.coerce
    .number()
    .int("Display order must be an integer")
    .min(0, "Display order must be 0 or greater")
    .default(0),
  is_published: z.coerce.boolean().default(true),
});
