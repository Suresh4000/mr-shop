import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Get the current authenticated user on the server.
 * Uses auth.getUser() to validate the JWT with the Supabase Auth server.
 * @returns {Promise<import("@supabase/supabase-js").User | null>}
 */
export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }
  return user;
}

/**
 * Check if the given user ID belongs to an authorized administrator.
 * @param {string} userId
 * @returns {Promise<boolean>}
 */
export async function isAdmin(userId) {
  if (!userId) return false;
  const supabase = await createClient();

  // Try the security-definer function first
  const { data: rpcIsAdmin, error: rpcErr } = await supabase.rpc("is_admin");
  if (!rpcErr && typeof rpcIsAdmin === "boolean") {
    return rpcIsAdmin;
  }

  // Fallback: direct query on admin_users table
  const { data: row } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  return Boolean(row?.user_id);
}

/**
 * Guard that requires an authenticated user.
 * Redirects to the specified path if unauthenticated.
 * @param {string} [redirectTo="/login"]
 */
export async function requireUser(redirectTo = "/login") {
  const user = await getUser();
  if (!user) {
    redirect(redirectTo);
  }
  return user;
}

/**
 * Server guard: requires an authenticated administrator.
 * Redirects if the user is unauthenticated or not an admin.
 * @param {string} [redirectTo="/admin/login"]
 */
export async function requireAdmin(redirectTo = "/admin/login") {
  const user = await getUser();
  if (!user) {
    redirect(redirectTo);
  }

  const authorized = await isAdmin(user.id);
  if (!authorized) {
    redirect(`${redirectTo}?error=forbidden`);
  }

  return user;
}

/**
 * Verify admin status without redirecting (for Server Actions).
 * @returns {Promise<{ user: import("@supabase/supabase-js").User | null, error: string | null }>}
 */
export async function verifyAdmin() {
  const user = await getUser();
  if (!user) {
    return { user: null, error: "Authentication required" };
  }

  const authorized = await isAdmin(user.id);
  if (!authorized) {
    return { user: null, error: "Forbidden: Admin privileges required" };
  }

  return { user, error: null };
}
