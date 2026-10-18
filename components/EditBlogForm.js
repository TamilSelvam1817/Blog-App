
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EditBlogForm({ id }) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    let cancelled = false;

    async function fetchBlog() {
      try {
        const response = await fetch(`/api/blogs/${id}`, {
          cache: "no-store",
        });

        const data = await response.json();

        if (response.status === 401) {
          router.replace(
            `/login?next=${encodeURIComponent(`/blogs/${id}/edit`)}`
          );
          return;
        }

        if (!response.ok) {
          throw new Error(data.message || "Could not load blog.");
        }

        if (!cancelled) {
          setTitle(data.blog.title || "");
          setContent(data.blog.content || "");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Could not load this blog.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchBlog();

    return () => {
      cancelled = true;
    };
  }, [id, router]);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setFieldErrors({});
    setSaving(true);

    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        router.replace(
          `/login?next=${encodeURIComponent(`/blogs/${id}/edit`)}`
        );
        return;
      }

      if (!response.ok) {
        setFieldErrors(data.errors || {});
        throw new Error(data.message || "Unable to update blog.");
      }

      router.push(`/blogs/${id}`);
      router.refresh();
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-950 px-4 text-slate-100">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-violet-500/20 border-t-violet-500" />
          <p className="mt-5 text-slate-400">Loading your article...</p>
        </div>
      </main>
    );
  }

  if (error && !title && !content) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-950 px-4 text-slate-100">
        <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900 p-8 text-center shadow-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-3xl text-red-400">
            !
          </div>

          <h1 className="mt-5 text-2xl font-bold">Unable to load blog</h1>

          <p className="mt-3 break-words text-slate-400">{error}</p>

          <Link
            href="/dashboard"
            className="mt-6 inline-flex rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white transition hover:bg-violet-500"
          >
            Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 sm:py-14">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -top-32 left-1/4 h-80 w-80 rounded-full bg-violet-600/15 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-1/3 h-80 w-80 rounded-full bg-blue-600/10 blur-3xl" />

      <div className="relative mx-auto max-w-3xl">
        {/* Breadcrumb */}
        <Link
          href="/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-violet-300"
        >
          <span aria-hidden="true">←</span>
          Back to Dashboard
        </Link>

        {/* Heading */}
        <div className="mb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-sm font-medium text-violet-300">
            <span aria-hidden="true">✎</span>
            Content Studio
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
            Edit your story
            <span className="mt-2 block bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              Make every word count.
            </span>
          </h1>

          <p className="mt-4 leading-7 text-slate-400">
            Refine your ideas, update your article, and keep your readers
            inspired.
          </p>
        </div>

        {/* Editor card */}
        <section className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/90 shadow-2xl shadow-black/30 backdrop-blur">
          <div className="h-1.5 bg-gradient-to-r from-violet-600 via-indigo-500 to-blue-500" />

          <div className="p-5 sm:p-8 lg:p-10">
            <div className="mb-8 flex items-center gap-4 border-b border-white/10 pb-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-xl text-violet-300">
                ✍
              </div>

              <div>
                <h2 className="text-lg font-bold">Article editor</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Your changes will be saved to your blog.
                </p>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm leading-6 text-red-300"
              >
                <p className="font-semibold">Something needs your attention</p>
                <p className="mt-1">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-7">
              {/* Title */}
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="title"
                    className="text-sm font-semibold text-slate-200"
                  >
                    Blog title <span className="text-violet-400">*</span>
                  </label>

                  <span
                    className={`text-xs ${
                      title.length >= 140
                        ? "text-amber-300"
                        : "text-slate-500"
                    }`}
                  >
                    {title.length}/150
                  </span>
                </div>

                <input
                  id="title"
                  name="title"
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  maxLength={150}
                  required
                  placeholder="Give your article a great title..."
                  aria-invalid={Boolean(fieldErrors.title?.length)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-4 text-base text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
                />

                {fieldErrors.title?.map((message) => (
                  <p key={message} className="mt-2 text-sm text-red-400">
                    {message}
                  </p>
                ))}
              </div>

              {/* Content */}
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="content"
                    className="text-sm font-semibold text-slate-200"
                  >
                    Article content{" "}
                    <span className="text-violet-400">*</span>
                  </label>

                  <span className="text-xs text-slate-500">
                    {content.length} characters
                  </span>
                </div>

                <textarea
                  id="content"
                  name="content"
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  rows={10}
                  required
                  placeholder="Start writing your story here..."
                  aria-invalid={Boolean(fieldErrors.content?.length)}
                  className="min-h-64 w-full resize-y rounded-xl border border-white/10 bg-slate-950/70 px-4 py-4 leading-7 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 sm:min-h-80"
                />

                {fieldErrors.content?.map((message) => (
                  <p key={message} className="mt-2 text-sm text-red-400">
                    {message}
                  </p>
                ))}

                <p className="mt-3 text-xs leading-5 text-slate-500">
                  Tip: Keep your title clear and your content easy to read.
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <Link
                  href={`/blogs/${id}`}
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 px-5 py-3 font-semibold text-slate-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={saving || !title.trim() || !content.trim()}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:-translate-y-0.5 hover:from-violet-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  {saving ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Saving changes...
                    </>
                  ) : (
                    <>
                      <span aria-hidden="true">✓</span>
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>

        <p className="mt-6 text-center text-sm text-slate-500">
          Your ideas deserve to be shared. Keep creating with BlogSpace.
        </p>
      </div>
    </main>
  );
}
