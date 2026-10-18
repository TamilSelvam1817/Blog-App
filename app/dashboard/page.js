
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/blogs?mine=true", {
        cache: "no-store",
      });

      const data = await response.json();

      if (response.status === 401) {
        router.replace(
          `/login?next=${encodeURIComponent("/dashboard")}`
        );
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Unable to load your blogs.");
      }

      setBlogs(Array.isArray(data.blogs) ? data.blogs : []);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const filteredBlogs = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return blogs;

    return blogs.filter(
      (blog) =>
        blog.title?.toLowerCase().includes(query) ||
        blog.content?.toLowerCase().includes(query)
    );
  }, [blogs, search]);

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this blog? This action cannot be undone."
    );

    if (!confirmed) return;

    setDeletingId(id);
    setError("");

    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.status === 401) {
        router.replace(
          `/login?next=${encodeURIComponent("/dashboard")}`
        );
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete this blog.");
      }

      setBlogs((currentBlogs) =>
        currentBlogs.filter((blog) => blog._id !== id)
      );
    } catch (err) {
      setError(err.message || "Could not delete the blog.");
    } finally {
      setDeletingId(null);
    }
  }

  function formatDate(date) {
    if (!date) return "Recently published";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Recently published";
    }

    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(parsedDate);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute top-96 -right-32 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Dashboard heading */}
        <section className="mb-10 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-600/20 via-slate-900 to-blue-600/10 p-6 shadow-2xl shadow-black/20 sm:p-10">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-400/10 px-3 py-1.5 text-sm font-medium text-violet-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Your personal workspace
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
                My Dashboard
                <span className="mt-2 block bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                  Your stories, your space.
                </span>
              </h1>

              <p className="mt-4 max-w-xl leading-7 text-slate-400">
                Create something meaningful, manage your articles, and
                share your ideas with the world.
              </p>
            </div>

            <Link
              href="/blogs/create"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-4 font-semibold text-white shadow-lg shadow-violet-900/30 transition hover:-translate-y-0.5 hover:from-violet-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              <span className="text-xl">+</span>
              Create New Blog
            </Link>
          </div>

          {/* Statistics */}
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
              <p className="text-sm text-slate-400">Total articles</p>
              <p className="mt-2 text-3xl font-bold">
                {loading ? "—" : blogs.length}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Your published blog posts
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
              <p className="text-sm text-slate-400">Workspace</p>
              <p className="mt-2 text-2xl font-bold text-violet-300">
                My Blogs
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Manage your own content
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
              <p className="text-sm text-slate-400">Your next step</p>
              <p className="mt-2 text-2xl font-bold text-emerald-300">
                Keep creating
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Every great story starts somewhere
              </p>
            </div>
          </div>
        </section>

        {/* Blog list header and search */}
        <section>
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
                Content manager
              </p>

              <h2 className="text-2xl font-bold sm:text-3xl">
                Your Articles
              </h2>

              <p className="mt-2 text-slate-400">
                Edit, view, or remove your published posts.
              </p>
            </div>

            <div className="w-full sm:max-w-sm">
              <label htmlFor="blog-search" className="sr-only">
                Search your blogs
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900 px-4 py-3 transition focus-within:border-violet-500">
                <svg
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0 text-slate-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m16 16 4 4" />
                </svg>

                <input
                  id="blog-search"
                  type="search"
                  placeholder="Search your articles..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                />
              </div>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div
              role="alert"
              className="mb-6 flex flex-col gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300 sm:flex-row sm:items-center sm:justify-between"
            >
              <p>{error}</p>

              <button
                type="button"
                onClick={fetchBlogs}
                className="self-start rounded-lg border border-red-400/30 px-4 py-2 text-sm font-semibold transition hover:bg-red-500/10 sm:self-auto"
              >
                Try again
              </button>
            </div>
          )}

          {/* Loading state */}
          {loading ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="animate-pulse rounded-2xl border border-white/10 bg-slate-900 p-6"
                >
                  <div className="mb-5 h-4 w-24 rounded bg-slate-800" />
                  <div className="mb-3 h-6 w-3/4 rounded bg-slate-800" />
                  <div className="mb-2 h-4 w-full rounded bg-slate-800" />
                  <div className="h-4 w-2/3 rounded bg-slate-800" />
                  <div className="mt-8 h-10 rounded-lg bg-slate-800" />
                </div>
              ))}
            </div>
          ) : filteredBlogs.length === 0 ? (
            /* Empty state */
            <div className="rounded-3xl border border-dashed border-white/15 bg-slate-900/60 px-6 py-16 text-center sm:py-20">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-violet-400/20 bg-violet-500/10 text-4xl">
                {search ? "⌕" : "✎"}
              </div>

              <h3 className="mt-6 text-xl font-bold">
                {search ? "No matching articles" : "Your story starts here"}
              </h3>

              <p className="mx-auto mt-3 max-w-md leading-7 text-slate-400">
                {search
                  ? "Try a different search term to find one of your articles."
                  : "You haven't published any blogs yet. Create your first article and it will appear here."}
              </p>

              {search ? (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="mt-6 rounded-xl border border-white/15 px-5 py-3 font-medium transition hover:bg-white/5"
                >
                  Clear Search
                </button>
              ) : (
                <Link
                  href="/blogs/create"
                  className="mt-6 inline-flex rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white transition hover:bg-violet-500"
                >
                  + Write Your First Blog
                </Link>
              )}
            </div>
          ) : (
            /* Blog cards */
            <>
              <p className="mb-4 text-sm text-slate-500">
                Showing {filteredBlogs.length} of {blogs.length}{" "}
                {blogs.length === 1 ? "article" : "articles"}
              </p>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filteredBlogs.map((blog, index) => (
                  <article
                    key={blog._id}
                    className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/90 transition duration-300 hover:-translate-y-1 hover:border-violet-500/50 hover:shadow-xl hover:shadow-violet-950/20"
                  >
                    <div className="h-1 bg-gradient-to-r from-violet-600 via-indigo-500 to-blue-500" />

                    <div className="flex flex-1 flex-col p-6">
                      <div className="mb-5 flex items-center justify-between gap-3">
                        <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-xs font-semibold text-violet-300">
                          Article #{index + 1}
                        </span>

                        <span className="text-xs text-slate-500">
                          {formatDate(blog.createdAt)}
                        </span>
                      </div>

                      <h3 className="break-words text-xl font-bold leading-snug text-white transition group-hover:text-violet-300">
                        {blog.title}
                      </h3>

                      <p className="mt-3 flex-1 whitespace-pre-line break-words leading-7 text-slate-400">
                        {blog.content?.length > 150
                          ? `${blog.content.slice(0, 150)}...`
                          : blog.content}
                      </p>

                      <div className="mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-5">
                        <Link
                          href={`/blogs/${blog._id}`}
                          className="inline-flex flex-1 items-center justify-center rounded-lg border border-white/10 px-3 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-blue-400/40 hover:bg-blue-400/10 hover:text-blue-300"
                        >
                          View
                        </Link>

                        <Link
                          href={`/blogs/${blog._id}/edit`}
                          className="inline-flex flex-1 items-center justify-center rounded-lg bg-violet-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500"
                        >
                          Edit
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleDelete(blog._id)}
                          disabled={deletingId === blog._id}
                          className="inline-flex flex-1 items-center justify-center rounded-lg border border-red-500/25 bg-red-500/10 px-3 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingId === blog._id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-14 border-t border-white/10 py-6 text-center text-sm text-slate-500">
          Made for your ideas. Powered by BlogSpace.
        </footer>
      </div>
    </main>
  );
}
