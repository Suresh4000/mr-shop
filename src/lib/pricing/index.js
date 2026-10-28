/**
 * Pricing module: The single source of truth for all monetary calculations.
 * Rule: Money is always integer paise. No floating-point values are ever stored or used in logic.
 */

/**
 * Format integer paise into Indian Rupee display format.
 * Examples:
 *   109900 -> "₹1,099"
 *   109950 -> "₹1,099.50"
 *   0      -> "₹0"
 * @param {number} paise
 * @returns {string}
 */
export function formatPaise(paise) {
  if (typeof paise !== "number" || isNaN(paise)) {
    return "₹0";
  }

  const isNegative = paise < 0;
  const absPaise = Math.abs(paise);
  const rupees = Math.floor(absPaise / 100);
  const remainingPaise = absPaise % 100;

  // Format integer rupees with Indian numbering system (e.g. 1,00,000)
  const rupeesStr = rupees.toLocaleString("en-IN");

  let result = "";
  if (remainingPaise > 0) {
    const paiseStr = remainingPaise.toString().padStart(2, "0");
    result = `₹${rupeesStr}.${paiseStr}`;
  } else {
    result = `₹${rupeesStr}`;
  }

  return isNegative ? `-${result}` : result;
}

/**
 * Convert Rupee string or number input into integer paise safely.
 * Prevents floating point inaccuracies (e.g. 899.99 -> 89999).
 * @param {string | number} input
 * @returns {number} Integer paise
 */
export function rupeesToPaise(input) {
  if (typeof input === "number") {
    if (isNaN(input)) throw new Error("Invalid rupee amount: NaN");
    return Math.round(input * 100);
  }

  if (typeof input === "string") {
    const cleaned = input.trim().replace(/^₹/, "").trim();
    if (!cleaned) throw new Error("Empty rupee amount");

    // Split on decimal point if present
    const parts = cleaned.split(".");
    if (parts.length > 2) throw new Error(`Invalid rupee format: ${input}`);

    const rupeesPart = parseInt(parts[0], 10);
    if (isNaN(rupeesPart)) throw new Error(`Invalid rupee amount: ${input}`);

    let paisePart = 0;
    if (parts.length === 2) {
      const frac = parts[1].padEnd(2, "0").slice(0, 2);
      paisePart = parseInt(frac, 10);
      if (isNaN(paisePart)) throw new Error(`Invalid paise amount: ${input}`);
    }

    return rupeesPart * 100 + paisePart;
  }

  throw new Error(`Unsupported rupee input type: ${typeof input}`);
}

/**
 * Convert integer paise to decimal string in rupees (e.g. 109900 -> "1099", 109950 -> "1099.50").
 * @param {number} paise
 * @returns {string}
 */
export function paiseToRupees(paise) {
  if (typeof paise !== "number" || isNaN(paise)) return "0";
  const rupees = Math.floor(paise / 100);
  const rem = paise % 100;
  if (rem === 0) return rupees.toString();
  return `${rupees}.${rem.toString().padStart(2, "0")}`;
}

