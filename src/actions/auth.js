"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth";
import { loginSchema } from "@/lib/validations/auth";

/**
 * Server action for admin sign-in.
 * Validates inputs, signs in against Supabase Auth, and verifies admin allow-list.
 */
export async function loginAdminAction(prevState, formData) {
  const rawEmail = formData.get("email");
  const rawPassword = formData.get("password");

  const parsed = loginSchema.safeParse({
    email: rawEmail,
    password: rawPassword,
  });

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return { error: firstIssue?.message || "Invalid email or password" };
  }

  const { email, password } = parsed.data;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data?.user) {
    return { error: error?.message || "Invalid credentials" };
  }

  // Authorize: user must exist in admin_users table
  const authorized = await isAdmin(data.user.id);
  if (!authorized) {
    // Immediately log out non-admin users attempting to access the admin portal
    await supabase.auth.signOut();
    return {
      error: "Access denied. Your account is not authorized as an administrator.",
    };
  }

  redirect("/admin");
}

/**
 * Server action to sign out from the admin portal.
 */
export async function signOutAdminAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

