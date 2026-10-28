import { describe, it, expect } from "vitest";
import { loginSchema } from "@/lib/validations/auth";

describe("loginSchema", () => {
  it("accepts valid email and password", () => {
    const result = loginSchema.safeParse({
      email: "admin@mrshop.com",
      password: "secretpassword123",
    });
    expect(result.success).toBe(true);
    expect(result.data.email).toBe("admin@mrshop.com");
  });

  it("trims whitespace from email", () => {
    const result = loginSchema.safeParse({
      email: "  admin@mrshop.com  ",
      password: "secretpassword123",
    });
    expect(result.success).toBe(true);
    expect(result.data.email).toBe("admin@mrshop.com");
  });

  it("rejects invalid email addresses", () => {
    const invalidEmails = ["notanemail", "@mrshop.com", "admin@", "admin@.com"];
    for (const email of invalidEmails) {
      const result = loginSchema.safeParse({
        email,
        password: "secretpassword123",
      });
      expect(result.success).toBe(false);
    }
  });

  it("rejects passwords shorter than 6 characters", () => {
    const result = loginSchema.safeParse({
      email: "admin@mrshop.com",
      password: "12345",
    });
    expect(result.success).toBe(false);
  });
});

