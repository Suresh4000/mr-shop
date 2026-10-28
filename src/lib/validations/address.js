import { z } from "zod";

// Indian pincode: 6 digits, first digit 1-9.
export const pincodeSchema = z.string().regex(/^[1-9][0-9]{5}$/, "Enter a valid 6-digit pincode");

// Indian mobile number: 10 digits starting 6-9, optional +91 or 0 prefix removed before validation.
export const phoneSchema = z
  .string()
  .transform((v) => v.replace(/[\s-]/g, "").replace(/^(\+91|0)/, ""))
  .pipe(z.string().regex(/^[6-9][0-9]{9}$/, "Enter a valid 10-digit mobile number"));
