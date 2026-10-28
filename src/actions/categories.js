"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { categorySchema } from "@/lib/validations/category";

/**
 * Create a new category. Enforces admin authorization and server-side validation.
 */
export async function createCategoryAction(prevState, formData) {
  await requireAdmin();
  const supabase = await createClient();

  const raw = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    display_order: formData.get("display_order"),
    is_published: formData.get("is_published") === "on" || formData.get("is_published") === "true",
  };

  const parsed = categorySchema.safeParse(raw);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { error: issue?.message || "Invalid category details", success: false };
  }

  const { data, error } = await supabase
    .from("categories")
    .insert([parsed.data])
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return { error: "A category with this URL slug already exists.", success: false };
    }
    return { error: error.message || "Failed to create category", success: false };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/");
  return { success: true, error: null, id: data.id };
}

/**
 * Update an existing category.
 */
export async function updateCategoryAction(prevState, formData) {
  await requireAdmin();
  const supabase = await createClient();

  const id = formData.get("id");
  if (!id) {
    return { error: "Category ID is required", success: false };
  }

  const raw = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    display_order: formData.get("display_order"),
    is_published: formData.get("is_published") === "on" || formData.get("is_published") === "true",
  };

  const parsed = categorySchema.safeParse(raw);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { error: issue?.message || "Invalid category details", success: false };
  }

  const { error } = await supabase
    .from("categories")
    .update(parsed.data)
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { error: "A category with this URL slug already exists.", success: false };
    }
    return { error: error.message || "Failed to update category", success: false };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/");
  return { success: true, error: null };
}

/**
 * Toggle category published/draft visibility.
 */
export async function togglePublishCategoryAction(id, currentStatus) {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("categories")
    .update({ is_published: !currentStatus })
    .eq("id", id);

  if (error) {
    return { error: error.message || "Failed to toggle status", success: false };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/");
  return { success: true };
}

/**
 * Delete a category. Preserves data integrity: prevents deleting categories with products.
 */
export async function deleteCategoryAction(id) {
  await requireAdmin();
  const supabase = await createClient();

  // Check if any products reference this category
  const { count, error: countError } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("category_id", id);

  if (countError) {
    return { error: countError.message, success: false };
  }

  if (count && count > 0) {
    return {
      error: `Cannot delete: category has ${count} associated dress${count > 1 ? "es" : ""}. Reassign or remove those dresses first.`,
      success: false,
    };
  }

  const { error: deleteError } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);

  if (deleteError) {
    return { error: deleteError.message, success: false };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/");
  return { success: true };
}
