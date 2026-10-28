import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { signOutAdminAction } from "@/actions/auth";

export const instant = false;

export default async function AdminDashboardLayout({ children }) {
  const adminUser = await requireAdmin();

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-8">
            <Link
              href="/admin"
              className="font-serif text-2xl font-bold tracking-tight text-[var(--foreground)]"
            >
              MR SHOP <span className="text-xs font-sans font-normal uppercase tracking-widest text-[var(--accent)] ml-1">Admin</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
              <Link
                href="/admin"
                className="rounded-lg px-3 py-1.5 text-[var(--foreground)]/80 hover:bg-[var(--foreground)]/5 hover:text-[var(--foreground)] transition"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/categories"
                className="rounded-lg px-3 py-1.5 text-[var(--foreground)]/80 hover:bg-[var(--foreground)]/5 hover:text-[var(--foreground)] transition"
              >
                Categories
              </Link>
              <Link
                href="/admin/products"
                className="rounded-lg px-3 py-1.5 text-[var(--foreground)]/80 hover:bg-[var(--foreground)]/5 hover:text-[var(--foreground)] transition"
              >
                Products
              </Link>
              <Link
                href="/admin/inventory"
                className="rounded-lg px-3 py-1.5 text-[var(--foreground)]/80 hover:bg-[var(--foreground)]/5 hover:text-[var(--foreground)] transition"
              >
                Inventory
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-xs text-[var(--foreground)]/60 font-mono">
              {adminUser.email}
            </span>
            <form action={signOutAdminAction}>
              <button
                type="submit"
                className="rounded-lg border border-[var(--border)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--foreground)] hover:bg-[var(--foreground)]/5 transition cursor-pointer"
              >
                Sign Out
              </button>
            </form>
            <Link
              href="/"
              target="_blank"
              className="rounded-lg bg-[var(--accent)] px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 transition"
            >
              View Store &rarr;
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}
