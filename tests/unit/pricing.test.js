import { describe, it, expect } from "vitest";
import { formatPaise, rupeesToPaise, paiseToRupees } from "@/lib/pricing";

describe("Pricing and Money (Rule: integer paise only)", () => {
  describe("formatPaise", () => {
    it("formats whole rupee paise amounts", () => {
      expect(formatPaise(109900)).toBe("₹1,099");
      expect(formatPaise(89900)).toBe("₹899");
      expect(formatPaise(199900)).toBe("₹1,999");
    });

    it("formats fractional paise amounts with 2 decimals", () => {
      expect(formatPaise(109950)).toBe("₹1,099.50");
      expect(formatPaise(109905)).toBe("₹1,099.05");
    });

    it("handles zero and edge cases", () => {
      expect(formatPaise(0)).toBe("₹0");
      expect(formatPaise(null)).toBe("₹0");
      expect(formatPaise(undefined)).toBe("₹0");
      expect(formatPaise(NaN)).toBe("₹0");
    });
  });

  describe("rupeesToPaise", () => {
    it("converts whole rupee inputs to integer paise", () => {
      expect(rupeesToPaise(1099)).toBe(109900);
      expect(rupeesToPaise("1099")).toBe(109900);
      expect(rupeesToPaise("₹1099")).toBe(109900);
    });

    it("converts decimal rupee inputs to integer paise without float inaccuracies", () => {
      expect(rupeesToPaise("899.99")).toBe(89999);
      expect(rupeesToPaise("1299.50")).toBe(129950);
      expect(rupeesToPaise("1299.5")).toBe(129950);
    });

    it("throws on invalid rupee formats", () => {
      expect(() => rupeesToPaise("abc")).toThrow();
      expect(() => rupeesToPaise("10.20.30")).toThrow();
    });
  });

  describe("paiseToRupees", () => {
    it("converts paise to clean string representation", () => {
      expect(paiseToRupees(109900)).toBe("1099");
      expect(paiseToRupees(109950)).toBe("1099.50");
      expect(paiseToRupees(0)).toBe("0");
    });
  });
});

