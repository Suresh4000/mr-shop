"use client";

import { useState, useActionState, useEffect } from "react";
import { createCategoryAction, updateCategoryAction } from "@/actions/categories";

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function CategoryForm({ category, onClose }) {
  const isEditing = Boolean(category?.id);
  const actionToUse = isEditing ? updateCategoryAction : createCategoryAction;
  const [state, formAction, isPending] = useActionState(actionToUse, null);

  const [name, setName] = useState(category?.name || "");
  const [slug, setSlug] = useState(category?.slug || "");
  const [displayOrder, setDisplayOrder] = useState(category?.display_order ?? 0);
  const [isPublished, setIsPublished] = useState(category?.is_published ?? true);
  const [manualSlug, setManualSlug] = useState(isEditing);

  useEffect(() => {
    if (state?.success) {
      onClose();
    }
  }, [state?.success, onClose]);

  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    if (!manualSlug && !isEditing) {
      setSlug(slugify(val));
    }
  };

  return (
    <div className="w-full max-w-lg rounded-2xl border border-[var(--border)] bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
      <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
        <h2 className="font-serif text-xl font-bold text-[var(--foreground)]">
          {isEditing ? "Edit Category" : "Add New Category"}
        </h2>
        <button
          onClick={onClose}
          type="button"
          className="rounded-lg p-1 text-[var(--foreground)]/50 hover:bg-[var(--foreground)]/5 hover:text-[var(--foreground)] transition cursor-pointer"
        >
          &times;
        </button>
      </div>

      {state?.error && (
        <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
          {state.error}
        </div>
      )}

      <form action={formAction} className="mt-5 space-y-4">
        {isEditing && <input type="hidden" name="id" value={category.id} />}

        <div>
          <label
            htmlFor="cat-name"
            className="block text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]/80"
          >
            Category Name
          </label>
          <input
            id="cat-name"
            name="name"
            type="text"
            required
            value={name}
            onChange={handleNameChange}
            placeholder="e.g. Summer Casuals"
            className="mt-1 w-full rounded-lg border border-[var(--border)] bg-white px-3.5 py-2 text-sm text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
        </div>

        <div>
          <label
            htmlFor="cat-slug"
            className="block text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]/80"
          >
            URL Slug
          </label>
          <input
            id="cat-slug"
            name="slug"
            type="text"
            required
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value.toLowerCase());
              setManualSlug(true);
            }}
            placeholder="e.g. summer-casuals"
            className="mt-1 w-full rounded-lg border border-[var(--border)] bg-white px-3.5 py-2 text-sm text-[var(--foreground)] font-mono focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
          <p className="mt-1 text-2xs text-[var(--foreground)]/50">
            Unique path identifier in URLs: /category/{slug || "slug"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="cat-order"
              className="block text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]/80"
            >
              Display Order
            </label>
            <input
              id="cat-order"
              name="display_order"
              type="number"
              min="0"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[var(--border)] bg-white px-3.5 py-2 text-sm text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            />
            <p className="mt-1 text-2xs text-[var(--foreground)]/50">
              Lower numbers appear first.
            </p>
          </div>

          <div className="flex items-center pt-5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="is_published"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="h-4 w-4 rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
              />
              <span className="text-xs font-medium text-[var(--foreground)]">
                Published (Visible in store)
              </span>
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-lg border border-[var(--border)] bg-white px-4 py-2 text-xs font-medium text-[var(--foreground)] hover:bg-[var(--foreground)]/5 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-[var(--foreground)] px-4 py-2 text-xs font-medium text-white hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
          >
            {isPending
              ? isEditing
                ? "Saving..."
                : "Creating..."
              : isEditing
                ? "Save Changes"
                : "Create Category"}
          </button>
        </div>
      </form>
    </div>
  );
}

export function CategoryModal({ isOpen, onClose, category = null }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
      <CategoryForm
        key={category?.id || "new-category"}
        category={category}
        onClose={onClose}
      />
    </div>
  );
}
