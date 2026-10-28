"use client";

import { useState, useTransition } from "react";
import { CategoryModal } from "./category-modal";
import {
  togglePublishCategoryAction,
  deleteCategoryAction,
} from "@/actions/categories";

export function CategoryList({ initialCategories = [] }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isPending, startTransition] = useTransition();

  const handleOpenAdd = () => {
    setActiveCategory(null);
    setErrorMessage(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (category) => {
    setActiveCategory(category);
    setErrorMessage(null);
    setModalOpen(true);
  };

  const handleTogglePublish = (id, currentStatus) => {
    setErrorMessage(null);
    startTransition(async () => {
      const res = await togglePublishCategoryAction(id, currentStatus);
      if (res?.error) {
        setErrorMessage(res.error);
      }
    });
  };

  const handleDelete = (id, name, productCount) => {
    if (productCount > 0) {
      setErrorMessage(
        `Cannot delete "${name}": it has ${productCount} dress(es) assigned. Reassign or delete those dresses first.`,
      );
      return;
    }

    if (!confirm(`Are you sure you want to delete the category "${name}"?`)) {
      return;
    }

    setErrorMessage(null);
    startTransition(async () => {
      const res = await deleteCategoryAction(id);
      if (res?.error) {
        setErrorMessage(res.error);
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-[var(--foreground)]">
            Categories
          </h1>
          <p className="mt-1 text-sm text-[var(--foreground)]/70">
            Manage dress catalog sections, display order and customer visibility.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--foreground)] px-4 py-2.5 text-xs font-medium text-white hover:opacity-90 transition cursor-pointer shadow-xs"
        >
          <span>+ Add Category</span>
        </button>
      </div>

      {errorMessage && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800 flex items-center justify-between">
          <span>{errorMessage}</span>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-rose-600 hover:text-rose-900 font-bold ml-4"
          >
            &times;
          </button>
        </div>
      )}

      {/* Categories Table */}
      <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-white shadow-xs">
        <table className="min-w-full divide-y divide-[var(--border)] text-left text-sm">
          <thead className="bg-[var(--background)]/60 text-2xs font-semibold uppercase tracking-wider text-[var(--foreground)]/70">
            <tr>
              <th scope="col" className="px-5 py-3 w-16">
                Order
              </th>
              <th scope="col" className="px-5 py-3">
                Category
              </th>
              <th scope="col" className="px-5 py-3">
                URL Slug
              </th>
              <th scope="col" className="px-5 py-3 text-center">
                Dresses
              </th>
              <th scope="col" className="px-5 py-3 text-center">
                Visibility
              </th>
              <th scope="col" className="px-5 py-3 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)] bg-white">
            {initialCategories.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-8 text-center text-xs text-[var(--foreground)]/60"
                >
                  No categories found. Click &quot;Add Category&quot; to create one.
                </td>
              </tr>
            ) : (
              initialCategories.map((cat) => (
                <tr
                  key={cat.id}
                  className="hover:bg-[var(--background)]/30 transition-colors"
                >
                  <td className="px-5 py-3.5 font-mono text-xs text-[var(--foreground)]/70">
                    {cat.display_order}
                  </td>
                  <td className="px-5 py-3.5 font-medium text-[var(--foreground)]">
                    {cat.name}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-[var(--foreground)]/60">
                    /{cat.slug}
                  </td>
                  <td className="px-5 py-3.5 text-center text-xs font-semibold text-[var(--foreground)]">
                    <span className="inline-block rounded-full bg-[var(--background)] px-2.5 py-0.5 text-xs text-[var(--foreground)] border border-[var(--border)]">
                      {cat.product_count ?? 0}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleTogglePublish(cat.id, cat.is_published)}
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-2xs font-semibold transition cursor-pointer ${
                        cat.is_published
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                          : "bg-zinc-100 text-zinc-600 border border-zinc-200 hover:bg-zinc-200"
                      }`}
                    >
                      {cat.is_published ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className="px-5 py-3.5 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(cat)}
                      className="rounded px-2 py-1 text-xs font-medium text-[var(--foreground)]/80 hover:bg-[var(--foreground)]/5 hover:text-[var(--foreground)] transition cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() =>
                        handleDelete(cat.id, cat.name, cat.product_count ?? 0)
                      }
                      className="rounded px-2 py-1 text-xs font-medium text-rose-700 hover:bg-rose-50 transition cursor-pointer disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <CategoryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        category={activeCategory}
      />
    </div>
  );
}
