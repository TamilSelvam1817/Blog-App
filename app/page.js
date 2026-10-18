
import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";

import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import User from "@/models/User";

async function HomeContent() {
  // Opt into request-time rendering before accessing MongoDB.
  await connection();

  let blogs = [];
  let databaseError = false;

  try {
    await connectDB();

    blogs = await Blog.find({})
      .sort({ createdAt: -1 })
      .limit(3)
      .populate("author", "name")
      .lean();
  } catch (error) {
    console.error("Home page blogs error:", error.message);
    databaseError = true;
  }

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <section className="relative">
        <div className="pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-40 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-2 lg:px-8 lg:py-32">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-sm font-medium text-violet-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              A space for ideas and creativity
            </div>

            <h1 className="mt-7 text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Your ideas
              <br />
              deserve to be
              <span className="mt-2 block bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                read.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-400 sm:text-lg">
              Discover interesting stories, share your knowledge, and turn
              your thoughts into articles that inspire others. Welcome to
              BlogSpace.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/blogs"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-7 py-4 font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:-translate-y-0.5 hover:from-violet-500 hover:to-indigo-500"
              >
                Explore Articles <span aria-hidden="true">→</span>
              </Link>

              <Link
                href="/blogs/create"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-7 py-4 font-semibold text-slate-200 transition hover:border-violet-400/30 hover:bg-violet-500/10"
              >
                <span aria-hidden="true">+</span>
                Write a Blog
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/10 pt-7">
              <div>
                <p className="text-2xl font-bold text-white">Create</p>
                <p className="mt-1 text-sm text-slate-500">Your own stories</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">Discover</p>
                <p className="mt-1 text-sm text-slate-500">Fresh perspectives</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">Share</p>
                <p className="mt-1 text-sm text-slate-500">Your knowledge</p>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-violet-600/20 to-blue-600/20 blur-2xl" />

            <div className="relative rotate-1 rounded-3xl border border-white/10 bg-slate-900 p-5 shadow-2xl shadow-black/40 sm:p-7">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 text-xl font-extrabold">
                    B
                  </div>
                  <div>
                    <p className="font-bold">BlogSpace</p>
                    <p className="text-xs text-slate-500">Ideas worth sharing</p>
                  </div>
                </div>

                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                  Create freely
                </span>
              </div>

              <div className="py-8">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
                  Your next chapter
                </p>
                <h2 className="mt-4 text-3xl font-extrabold leading-snug sm:text-4xl">
                  Every great idea starts with a single word.
                </h2>
                <p className="mt-4 leading-7 text-slate-400">
                  Write about what you love. Share what you learn. Give your
                  ideas a place to grow.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-violet-500/20" />
                  <div className="flex-1">
                    <div className="h-3 w-2/3 rounded-full bg-slate-700" />
                    <div className="mt-2 h-2 w-1/3 rounded-full bg-slate-800" />
                  </div>
                  <span className="text-xl text-violet-400">✦</span>
                </div>
                <div className="mt-4 h-2 w-full rounded-full bg-slate-800" />
                <div className="mt-2 h-2 w-5/6 rounded-full bg-slate-800" />
                <div className="mt-2 h-2 w-2/3 rounded-full bg-slate-800" />
              </div>

              <p className="mt-5 text-center text-xs text-slate-500">
                Your thoughts. Your voice. Your BlogSpace.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
                From the community
              </p>
              <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                Latest Articles
              </h2>
              <p className="mt-3 text-slate-400">
                Explore the latest ideas published on BlogSpace.
              </p>
            </div>

            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 self-start font-semibold text-violet-300 transition hover:text-violet-200 sm:self-auto"
            >
              View all articles <span aria-hidden="true">→</span>
            </Link>
          </div>

          {databaseError ? (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-slate-300">
              <p>We couldn't load the latest articles right now.</p>
              <Link
                href="/blogs"
                className="mt-3 inline-block text-violet-300 hover:underline"
              >
                Visit All Blogs
              </Link>
            </div>
          ) : blogs.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/15 bg-slate-900/60 px-6 py-14 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 text-3xl text-violet-300">
                ✎
              </div>
              <h3 className="mt-5 text-xl font-bold">
                Be the first to share a story
              </h3>
              <p className="mt-3 text-slate-400">
                Your first article could inspire someone today.
              </p>
              <Link
                href="/blogs/create"
                className="mt-6 inline-flex rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white transition hover:bg-violet-500"
              >
                Create Your First Blog
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {blogs.map((blog) => (
                <article
                  key={blog._id.toString()}
                  className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900 transition duration-300 hover:-translate-y-1 hover:border-violet-500/50 hover:shadow-xl hover:shadow-violet-950/20"
                >
                  <div className="h-1 bg-gradient-to-r from-violet-600 via-indigo-500 to-blue-500" />
                  <div className="flex flex-1 flex-col p-6">
                    <span className="self-start rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-xs font-semibold text-violet-300">
                      Latest article
                    </span>

                    <h3 className="mt-5 break-words text-xl font-bold leading-snug text-white transition group-hover:text-violet-300">
                      {blog.title}
                    </h3>

                    <p className="mt-3 flex-1 whitespace-pre-line break-words leading-7 text-slate-400">
                      {(blog.content || "").length > 140
                        ? `${blog.content.slice(0, 140)}...`
                        : blog.content}
                    </p>

                    <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/10 pt-5">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-300">
                          {blog.author?.name || "Unknown author"}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {blog.createdAt
                            ? new Date(blog.createdAt).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )
                            : "Recently published"}
                        </p>
                      </div>

                      <Link
                        href={`/blogs/${blog._id}`}
                        className="shrink-0 rounded-lg bg-violet-500/10 px-3 py-2 text-sm font-semibold text-violet-300 transition hover:bg-violet-500/20"
                      >
                        Read →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-600/20 via-slate-900 to-blue-600/10 px-6 py-12 text-center sm:px-12 sm:py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">
            Your turn
          </p>
          <h2 className="mt-4 text-3xl font-extrabold sm:text-5xl">
            Have an idea to share?
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-400">
            Start writing today. Your experience, knowledge, and perspective
            could be exactly what someone needs to read.
          </p>
          <Link
            href="/blogs/create"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-7 py-4 font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:-translate-y-0.5 hover:from-violet-500 hover:to-indigo-500"
          >
            Start Writing <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/10 px-4 py-7 text-center text-sm text-slate-500">
        BlogSpace — Discover ideas. Share knowledge. Grow together.
      </footer>
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-300">
          Loading BlogSpace...
        </main>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
