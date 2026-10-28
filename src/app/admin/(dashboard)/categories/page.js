import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { CategoryList } from "@/components/admin/category-list";

export const instant = false;

export default async function AdminCategoriesPage() {
  // Opt into request-time rendering (required when Supabase calls use Date.now() internally)
  await connection();

  const supabase = await createClient();

  // Fetch all categories sorted by display order
  const { data: categories, error: catError } = await supabase
    .from("categories")
    .select("id, slug, name, display_order, is_published, created_at")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (catError) {
    throw new Error(`Failed to load categories: ${catError.message}`);
  }

  // Fetch product count per category
  const { data: productCounts } = await supabase
    .from("products")
    .select("category_id");

  const countsByCat = (productCounts || []).reduce((acc, p) => {
    if (p.category_id) {
      acc[p.category_id] = (acc[p.category_id] || 0) + 1;
    }
    return acc;
  }, {});

  const categoriesWithCounts = (categories || []).map((cat) => ({
    ...cat,
    product_count: countsByCat[cat.id] || 0,
  }));

  return <CategoryList initialCategories={categoriesWithCounts} />;
}
