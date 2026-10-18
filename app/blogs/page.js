
import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";

import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import User from "@/models/User";
import BlogListClient from "@/components/BlogListClient";

async function AllBlogs() {
  // Tell Next.js to render this page at request time.
  // This must run before accessing MongoDB.
  await connection();

  let blogs = [];

  try {
    await connectDB();

    blogs = await Blog.find({})
      .sort({ createdAt: -1 })
      .populate("author", "name")
      .lean();

    // Convert MongoDB values into serializable values.
    blogs = blogs.map((blog) => ({
      ...blog,
      _id: blog._id.toString(),
      author: blog.author
        ? {
            _id: blog.author._id.toString(),
            name: blog.author.name,
          }
        : null,
      createdAt: blog.createdAt
        ? blog.createdAt.toISOString()
        : null,
    }));
  } catch (error) {
    console.error("All blogs page error:", error.message);

    return (
      <main className="min-h-screen bg-slate-950 px-5 py-20 text-center text-white">
        <h1 className="text-3xl font-bold">Unable to load blogs</h1>

        <p className="mt-3 text-slate-400">
          Please check your database connection and try again.
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex rounded-xl bg-violet-600 px-5 py-3 font-semibold transition hover:bg-violet-500"
        >
          Back to Home
        </Link>
      </main>
    );
  }

  return <BlogListClient blogs={blogs} />;
}

export default function BlogsPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-300">
          Loading articles...
        </main>
      }
    >
      <AllBlogs />
    </Suspense>
  );
}
