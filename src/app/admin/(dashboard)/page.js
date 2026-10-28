import Link from "next/link";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const instant = false;

export default async function AdminDashboardPage() {
  await connection();
  const supabase = await createClient();

  const [categoriesRes, productsRes, inventoryRes] = await Promise.all([
    supabase.from("categories").select("id", { count: "exact" }),
    supabase.from("products").select("id, status", { count: "exact" }),
    supabase.from("inventory").select("available"),
  ]);

  const categoryCount = categoriesRes.count ?? 0;
  const productCount = productsRes.count ?? 0;
  const totalStock = (inventoryRes.data ?? []).reduce(
    (sum, item) => sum + (item.available ?? 0),
    0,
  );
  const lowStockCount = (inventoryRes.data ?? []).filter(
    (item) => (item.available ?? 0) <= 2,
  ).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-[var(--foreground)]">
          Store Overview
        </h1>
        <p className="mt-1 text-sm text-[var(--foreground)]/70">
          Welcome to the MR SHOP Administration. Catalog and stock summary.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[var(--border)] bg-white p-5 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]/60">
            Categories
          </div>
          <div className="mt-2 text-3xl font-serif font-bold text-[var(--foreground)]">
            {categoryCount}
          </div>
          <div className="mt-2 text-xs text-[var(--accent)] font-medium">
            <Link href="/admin/categories">Manage categories &rarr;</Link>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-white p-5 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]/60">
            Active Dresses
          </div>
          <div className="mt-2 text-3xl font-serif font-bold text-[var(--foreground)]">
            {productCount}
          </div>
          <div className="mt-2 text-xs text-[var(--accent)] font-medium">
            <Link href="/admin/products">View catalog &rarr;</Link>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-white p-5 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]/60">
            Total Inventory Units
          </div>
          <div className="mt-2 text-3xl font-serif font-bold text-[var(--foreground)]">
            {totalStock}
          </div>
          <div className="mt-2 text-xs text-[var(--accent)] font-medium">
            <Link href="/admin/inventory">View stock &rarr;</Link>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-white p-5 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]/60">
            Low Stock Alerts (&le; 2)
          </div>
          <div className="mt-2 text-3xl font-serif font-bold text-amber-600">
            {lowStockCount}
          </div>
          <div className="mt-2 text-xs text-amber-700 font-medium">
            {lowStockCount > 0 ? "Requires restock" : "Stock healthy"}
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-[var(--border)] bg-white/70 p-6 backdrop-blur">
          <h2 className="font-serif text-lg font-bold text-[var(--foreground)]">
            1. Categories
          </h2>
          <p className="mt-2 text-xs text-[var(--foreground)]/70 leading-relaxed">
            Organize catalog sections: Casual, Party, Ethnic, Office. Set display order and visibility.
          </p>
          <Link
            href="/admin/categories"
            className="mt-4 inline-block rounded-lg bg-[var(--foreground)] px-4 py-2 text-xs font-medium text-white hover:opacity-90 transition"
          >
            Manage Categories
          </Link>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-white/70 p-6 backdrop-blur">
          <h2 className="font-serif text-lg font-bold text-[var(--foreground)]">
            2. Products & Variants
          </h2>
          <p className="mt-2 text-xs text-[var(--foreground)]/70 leading-relaxed">
            Create new dresses, configure sizes (S, M, L, XL), colors (Plum, Rose), and prices in paise.
          </p>
          <Link
            href="/admin/products"
            className="mt-4 inline-block rounded-lg bg-[var(--foreground)] px-4 py-2 text-xs font-medium text-white hover:opacity-90 transition"
          >
            Manage Products
          </Link>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-white/70 p-6 backdrop-blur">
          <h2 className="font-serif text-lg font-bold text-[var(--foreground)]">
            3. Inventory by Variant
          </h2>
          <p className="mt-2 text-xs text-[var(--foreground)]/70 leading-relaxed">
            Monitor variant stock levels, record adjustments with reasons, and handle stock replenishment.
          </p>
          <Link
            href="/admin/inventory"
            className="mt-4 inline-block rounded-lg bg-[var(--foreground)] px-4 py-2 text-xs font-medium text-white hover:opacity-90 transition"
          >
            View Inventory
          </Link>
        </div>
      </div>
    </div>
  );
}
