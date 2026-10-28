import { describe, it, expect } from "vitest";
import { categorySchema } from "@/lib/validations/category";

describe("categorySchema", () => {
  it("accepts valid category attributes", () => {
    const result = categorySchema.safeParse({
      name: "Evening Gowns",
      slug: "evening-gowns",
      display_order: 1,
      is_published: true,
    });
    expect(result.success).toBe(true);
    expect(result.data.name).toBe("Evening Gowns");
    expect(result.data.slug).toBe("evening-gowns");
    expect(result.data.display_order).toBe(1);
    expect(result.data.is_published).toBe(true);
  });

  it("normalises and trims uppercase or spaced slugs", () => {
    const result = categorySchema.safeParse({
      name: "Party Wear",
      slug: "Party-Wear",
      display_order: "2",
      is_published: "true",
    });
    expect(result.success).toBe(true);
    expect(result.data.slug).toBe("party-wear");
    expect(result.data.display_order).toBe(2);
    expect(result.data.is_published).toBe(true);
  });

  it("rejects invalid slugs with special characters or consecutive hyphens", () => {
    const invalidSlugs = ["party wear", "party--wear", "-party", "party-", "party_wear", "party!"];
    for (const slug of invalidSlugs) {
      const result = categorySchema.safeParse({
        name: "Party Wear",
        slug,
      });
      expect(result.success).toBe(false);
    }
  });

  it("rejects short or empty names", () => {
    const result = categorySchema.safeParse({
      name: "A",
      slug: "valid-slug",
    });
    expect(result.success).toBe(false);
  });
});
