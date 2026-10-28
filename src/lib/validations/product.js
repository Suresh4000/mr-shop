import { z } from "zod";

export const variantSchema = z.object({
  id: z.string().uuid().optional(),
  size: z.string().trim().min(1, "Size is required").max(20, "Size is too long"),
  colour: z.string().trim().min(1, "Colour is required").max(30, "Colour is too long"),
  sku: z
    .string()
    .trim()
    .toUpperCase()
    .min(2, "SKU must be at least 2 characters")
    .max(50, "SKU must not exceed 50 characters")
    .regex(/^[A-Z0-9_-]+$/, "SKU must only contain uppercase letters, numbers, hyphens and underscores"),
  price_paise: z.coerce
    .number()
    .int("Price must be an integer (in paise)")
    .positive("Price must be greater than zero"),
  initial_stock: z.coerce
    .number()
    .int("Stock must be an integer")
    .min(0, "Stock cannot be negative")
    .default(0),
});

export const productSchema = z.object({
  id: z.string().uuid().optional(),
  name: z
    .string()
    .trim()
    .min(2, "Product name must be at least 2 characters")
    .max(100, "Product name must not exceed 100 characters"),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(2, "Slug must be at least 2 characters")
    .max(100, "Slug must not exceed 100 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers, and hyphens",
    ),
  category_id: z.string().uuid("Please select a valid category"),
  description: z.string().trim().min(5, "Description must be at least 5 characters"),
  fabric_and_care: z
    .string()
    .trim()
    .min(3, "Fabric and care instructions must be at least 3 characters"),
  gst_rate_bps: z.coerce
    .number()
    .int("GST rate must be an integer")
    .min(0, "GST rate cannot be negative")
    .default(500),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  variants: z
    .array(variantSchema)
    .min(1, "At least one variant (size and colour) is required")
    .refine(
      (variants) => {
        // Enforce unique (size, colour) pairs
        const seen = new Set();
        for (const v of variants) {
          const key = `${v.size.toLowerCase()}_${v.colour.toLowerCase()}`;
          if (seen.has(key)) return false;
          seen.add(key);
        }
        return true;
      },
      { message: "Duplicate variant detected: each size and colour combination must be unique" },
    )
    .refine(
      (variants) => {
        // Enforce unique SKUs
        const seen = new Set();
        for (const v of variants) {
          const key = v.sku.toUpperCase();
          if (seen.has(key)) return false;
          seen.add(key);
        }
        return true;
      },
      { message: "Duplicate SKU detected: each variant must have a unique SKU" },
    ),
});

