
"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function getSafeRedirectPath(next) {
  if (typeof next !== "string" || !next.startsWith("/")) {
    return "/dashboard";
  }

  // Reject protocol-relative URLs and backslash-based URL tricks.
  if (next.startsWith("//") || next.includes("\\")) {
    return "/dashboard";
  }

  try {
    const baseUrl = "https://blogspace.invalid";
    const destination = new URL(next, baseUrl);

    // Only allow same-origin, local paths.
    if (destination.origin !== baseUrl) {
      return "/dashboard";
    }

    // Avoid redirects to login itself.
    if (destination.pathname === "/login") {
      return "/dashboard";
    }

    return `${destination.pathname}${destination.search}${destination.hash}`;
  } catch {
    return "/dashboard";
  }
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const next = searchParams.get("next");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      const destination = getSafeRedirectPath(next);

      router.replace(destination);
      router.refresh();
    } catch (err) {
      setError(err.message || "Unable to log in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <div className="rounded-lg border border-gray-200 p-6 shadow-sm">
        <h1 className="mb-2 text-3xl font-bold">Login</h1>

        <p className="mb-6 text-gray-600">
          Sign in to continue to BlogSpace.
        </p>

        {error && (
          <div
            role="alert"
            className="mb-4 rounded border border-red-300 bg-red-50 p-3 text-red-700"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block font-medium">
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
              className="w-full rounded border border-gray-300 p-3"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block font-medium">
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
              className="w-full rounded border border-gray-300 p-3"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-5 text-center text-gray-600">
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<p className="p-8 text-center">Loading login...</p>}>
      <LoginForm />
    </Suspense>
  );
}
