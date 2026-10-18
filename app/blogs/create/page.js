
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateBlogPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/login?next=/blogs/create");
          return;
        }

        setError(data.message || "Failed to publish blog.");
        return;
      }

      if (!data.blog?._id) {
        setError("Blog was created, but its ID was not returned.");
        return;
      }

      router.push(`/blogs/${data.blog._id}`);
      router.refresh();
    } catch (err) {
      console.error("Create blog error:", err);
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-3xl font-bold">Create a Blog</h1>

      <p className="mt-2 text-slate-600">
        Share something useful with the community.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label htmlFor="title" className="mb-2 block font-medium">
            Blog Title
          </label>

          <input
            id="title"
            name="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            maxLength={150}
            className="w-full rounded-lg border px-4 py-3"
            placeholder="Enter your blog title"
          />
        </div>

        <div>
          <label htmlFor="content" className="mb-2 block font-medium">
            Blog Content
          </label>

          <textarea
            id="content"
            name="content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            required
            maxLength={20000}
            rows={10}
            className="w-full rounded-lg border px-4 py-3"
            placeholder="Write your blog content..."
          />
        </div>

        {error && (
          <p role="alert" className="rounded-lg bg-red-100 p-3 text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Publishing..." : "Publish Blog"}
        </button>
      </form>
    </main>
  );
}
