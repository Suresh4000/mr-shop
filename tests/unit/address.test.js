import { describe, it, expect } from "vitest";
import { pincodeSchema, phoneSchema } from "@/lib/validations/address";

describe("pincodeSchema", () => {
  it("accepts valid pincodes", () => {
    expect(pincodeSchema.safeParse("600001").success).toBe(true);
  });
  it("rejects leading zero, wrong length and letters", () => {
    for (const v of ["060001", "60001", "6000011", "60000a"]) {
      expect(pincodeSchema.safeParse(v).success).toBe(false);
    }
  });
});

describe("phoneSchema", () => {
  it("normalises +91, 0 prefix and spaces", () => {
    for (const v of ["9876543210", "+91 98765 43210", "09876543210"]) {
      const r = phoneSchema.safeParse(v);
      expect(r.success).toBe(true);
      expect(r.data).toBe("9876543210");
    }
  });
  it("rejects bad numbers", () => {
    for (const v of ["5876543210", "98765", "abcdefghij"]) {
      expect(phoneSchema.safeParse(v).success).toBe(false);
    }
  });
});
