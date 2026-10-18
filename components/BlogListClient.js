
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export default function BlogListClient({ blogs }) {
  const [search, setSearch] = useState("");

  const filteredBlogs = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return blogs;

    return blogs.filter(
      (blog) =>
        blog.title?.toLowerCase().includes(query) ||
        blog.content?.toLowerCase().includes(query) ||
        blog.author?.name?.toLowerCase().includes(query)
    );
  }, [blogs, search]);

  function formatDate(date) {
    if (!date) return "Recently published";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 sm:py-14">
      <div className="pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-violet-600/15 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-96 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <section className="mb-10 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-600/20 via-slate-900 to-blue-600/10 p-6 sm:p-10">
          <div className="flex flex-col justify-between gap-7 md:flex-row md:items-center">
            <div>
              <span className="inline-flex rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-sm font-medium text-violet-300">
                The BlogSpace community
              </span>

              <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">
                Discover great
                <span className="mt-2 block bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                  ideas and stories.
                </span>
              </h1>

              <p className="mt-4 max-w-xl leading-7 text-slate-400">
                Explore articles, learn something new, and get inspired by
                ideas shared by the BlogSpace community.
              </p>
            </div>

            <Link
              href="/blogs/create"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-4 font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:-translate-y-0.5 hover:from-violet-500 hover:to-indigo-500"
            >
              <span className="text-xl">+</span>
              Create a Blog
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:max-w-lg">
            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <p className="text-sm text-slate-400">Published articles</p>
              <p className="mt-1 text-3xl font-bold">{blogs.length}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <p className="text-sm text-slate-400">Your next read</p>
              <p className="mt-2 text-lg font-bold text-violet-300">
                Starts here ✨
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
                Explore
              </p>
              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                Latest Articles
              </h2>
              <p className="mt-2 text-slate-400">
                Find your next interesting read.
              </p>
            </div>

            <div className="w-full sm:max-w-sm">
              <label htmlFor="blog-search" className="sr-only">
                Search articles
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900 px-4 py-3 focus-within:border-violet-500">
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
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search title, content, author..."
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                />
              </div>
            </div>
          </div>

          <p className="mb-5 text-sm text-slate-500">
            Showing {filteredBlogs.length} of {blogs.length} articles
          </p>

          {filteredBlogs.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/15 bg-slate-900/60 px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 text-3xl text-violet-300">
                ⌕
              </div>

              <h3 className="mt-5 text-xl font-bold">
                {search ? "No matching articles" : "No articles published yet"}
              </h3>

              <p className="mt-3 text-slate-400">
                {search
                  ? "Try another search term."
                  : "Be the first to share a story with the community."}
              </p>

              {search ? (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="mt-5 rounded-xl border border-white/10 px-5 py-3 font-semibold hover:bg-white/5"
                >
                  Clear Search
                </button>
              ) : (
                <Link
                  href="/blogs/create"
                  className="mt-5 inline-flex rounded-xl bg-violet-600 px-5 py-3 font-semibold hover:bg-violet-500"
                >
                  Create the First Blog
                </Link>
              )}
            </div>
          ) : (
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
                        Article {index + 1}
                      </span>

                      <span className="text-xs text-slate-500">
                        {formatDate(blog.createdAt)}
                      </span>
                    </div>

                    <h3 className="break-words text-xl font-bold leading-snug text-white transition group-hover:text-violet-300">
                      {blog.title}
                    </h3>

                    <p className="mt-3 flex-1 whitespace-pre-line break-words leading-7 text-slate-400">
                      {(blog.content || "").length > 150
                        ? `${blog.content.slice(0, 150)}...`
                        : blog.content}
                    </p>

                    <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 font-bold text-white">
                        {(blog.author?.name || "A")
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-300">
                          {blog.author?.name || "Unknown author"}
                        </p>
                        <p className="text-xs text-slate-500">Author</p>
                      </div>
                    </div>

                    <Link
                      href={`/blogs/${blog._id}`}
                      className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl border border-violet-400/20 bg-violet-500/10 px-4 py-3 font-semibold text-violet-300 transition hover:border-violet-400/40 hover:bg-violet-500/20"
                    >
                      Read Article
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="mt-14 border-t border-white/10 py-6 text-center text-sm text-slate-500">
          Discover ideas. Share knowledge. Grow together.
        </footer>
      </div>
    </main>
  );
}
