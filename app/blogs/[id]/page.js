
import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import mongoose from "mongoose";

import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import User from "@/models/User";

async function BlogDetails({ params }) {
  await connection();

  const { id } = await params;

  let blog;

  try {
    if (!mongoose.isValidObjectId(id)) {
      return <NotFound />;
    }

    await connectDB();

    blog = await Blog.findById(id)
      .populate("author", "name")
      .lean();
  } catch (error) {
    console.error("Blog details error:", error.message);

    return (
      <main className="min-h-screen bg-slate-950 px-4 py-20 text-slate-100">
        <div className="mx-auto max-w-xl rounded-3xl border border-red-500/20 bg-slate-900 p-8 text-center">
          <h1 className="text-2xl font-bold">Unable to load article</h1>
          <p className="mt-3 text-slate-400">
            Something went wrong while loading this blog. Please try again.
          </p>
          <Link
            href="/blogs"
            className="mt-6 inline-flex rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white hover:bg-violet-500"
          >
            Back to Blogs
          </Link>
        </div>
      </main>
    );
  }

  if (!blog) {
    return <NotFound />;
  }

  const createdDate = blog.createdAt
    ? new Date(blog.createdAt)
    : null;

  const updatedDate = blog.updatedAt
    ? new Date(blog.updatedAt)
    : null;

  const wasUpdated =
    createdDate &&
    updatedDate &&
    updatedDate.getTime() > createdDate.getTime() + 1000;

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 sm:py-14">
      <div className="pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-violet-600/15 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-1/3 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

      <div className="relative mx-auto max-w-4xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-violet-300"
          >
            <span aria-hidden="true">←</span>
            Back to all blogs
          </Link>

          <Link
            href="/dashboard"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-violet-400/40 hover:bg-violet-500/10"
          >
            My Dashboard
          </Link>
        </div>

        <article className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/90 shadow-2xl shadow-black/30 backdrop-blur">
          <div className="h-1.5 bg-gradient-to-r from-violet-600 via-indigo-500 to-blue-500" />

          <div className="p-6 sm:p-10 lg:p-12">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-violet-300">
                BlogSpace Article
              </span>

              {wasUpdated && (
                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                  Recently updated
                </span>
              )}
            </div>

            <h1 className="break-words text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              {blog.title}
            </h1>

            <div className="mt-7 flex flex-wrap items-center gap-4 border-b border-white/10 pb-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 text-lg font-bold text-white shadow-lg shadow-violet-950/30">
                {(blog.author?.name || "A").charAt(0).toUpperCase()}
              </div>

              <div>
                <p className="font-semibold text-slate-200">
                  {blog.author?.name || "Unknown author"}
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Published{" "}
                  {createdDate && !Number.isNaN(createdDate.getTime())
                    ? createdDate.toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "date unavailable"}
                </p>
              </div>
            </div>

            <div className="py-8 sm:py-10">
              <div className="whitespace-pre-wrap break-words text-base leading-8 text-slate-300 sm:text-lg sm:leading-9">
                {blog.content}
              </div>
            </div>

            {wasUpdated && (
              <p className="border-t border-white/10 pt-5 text-sm text-slate-500">
                Last updated{" "}
                {updatedDate.toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3 border-t border-white/10 bg-slate-950/50 p-6 sm:flex-row sm:items-center sm:justify-between sm:px-10">
            <p className="text-sm text-slate-400">
              Thanks for reading on BlogSpace.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/blogs"
                className="inline-flex items-center justify-center rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
              >
                Explore Blogs
              </Link>

              <Link
                href={`/blogs/${id}/edit`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:-translate-y-0.5 hover:from-violet-500 hover:to-indigo-500"
              >
                <span aria-hidden="true">✎</span>
                Edit Article
              </Link>
            </div>
          </div>
        </article>

        <footer className="mt-8 text-center text-sm text-slate-500">
          Every story matters. Keep sharing yours.
        </footer>
      </div>
    </main>
  );
}

function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-slate-950 px-4 text-slate-100">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 text-3xl text-violet-300">
          ?
        </div>

        <h1 className="mt-5 text-2xl font-bold">Blog not found</h1>

        <p className="mt-3 text-slate-400">
          This article may have been deleted or the link may be incorrect.
        </p>

        <Link
          href="/blogs"
          className="mt-6 inline-flex rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white transition hover:bg-violet-500"
        >
          Browse All Blogs
        </Link>
      </div>
    </main>
  );
}

export default function BlogDetailsPage({ params }) {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-300">
          Loading article...
        </main>
      }
    >
      <BlogDetails params={params} />
    </Suspense>
  );
}
