import { describe, it, expect } from "vitest";
import { productSchema, variantSchema } from "@/lib/validations/product";

describe("productSchema and variantSchema", () => {
  const validCategoryId = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";

  it("accepts valid product with variants", () => {
    const validData = {
      name: "Floral Summer Dress",
      slug: "floral-summer-dress",
      category_id: validCategoryId,
      description: "Lightweight and breathable summer dress with floral prints.",
      fabric_and_care: "100% Cotton. Cold wash only.",
      gst_rate_bps: 500,
      status: "published",
      variants: [
        {
          size: "S",
          colour: "Plum",
          sku: "FLR-S-PLUM",
          price_paise: 119900,
          initial_stock: 5,
        },
        {
          size: "M",
          colour: "Plum",
          sku: "FLR-M-PLUM",
          price_paise: 119900,
          initial_stock: 10,
        },
      ],
    };

    const res = productSchema.safeParse(validData);
    expect(res.success).toBe(true);
    expect(res.data.variants.length).toBe(2);
    expect(res.data.variants[0].sku).toBe("FLR-S-PLUM");
  });

  it("rejects duplicate (size, colour) variants", () => {
    const duplicateData = {
      name: "Floral Summer Dress",
      slug: "floral-summer-dress",
      category_id: validCategoryId,
      description: "Valid description here.",
      fabric_and_care: "Cotton",
      variants: [
        { size: "S", colour: "Plum", sku: "FLR-S-1", price_paise: 100000 },
        { size: "S", colour: "Plum", sku: "FLR-S-2", price_paise: 100000 },
      ],
    };
    const res = productSchema.safeParse(duplicateData);
    expect(res.success).toBe(false);
  });

  it("rejects duplicate SKUs", () => {
    const duplicateSku = {
      name: "Floral Summer Dress",
      slug: "floral-summer-dress",
      category_id: validCategoryId,
      description: "Valid description here.",
      fabric_and_care: "Cotton",
      variants: [
        { size: "S", colour: "Plum", sku: "SAME-SKU", price_paise: 100000 },
        { size: "M", colour: "Rose", sku: "SAME-SKU", price_paise: 100000 },
      ],
    };
    const res = productSchema.safeParse(duplicateSku);
    expect(res.success).toBe(false);
  });

  it("rejects empty variants array", () => {
    const noVariants = {
      name: "Floral Summer Dress",
      slug: "floral-summer-dress",
      category_id: validCategoryId,
      description: "Valid description here.",
      fabric_and_care: "Cotton",
      variants: [],
    };
    const res = productSchema.safeParse(noVariants);
    expect(res.success).toBe(false);
  });
});

