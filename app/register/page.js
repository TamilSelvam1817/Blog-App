
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(event) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || data.error || "Registration failed."
        );
        return;
      }

      setSuccess("Account created successfully! Redirecting to login...");

      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (err) {
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-3xl font-bold">
        Create Your Account
      </h1>

      <p className="mt-2 text-slate-600">
        Join BlogSpace and start sharing your ideas.
      </p>

      <form onSubmit={handleRegister} className="mt-8 space-y-5">
        <div>
          <label htmlFor="name" className="mb-2 block font-medium">
            Full Name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            className="w-full rounded-lg border px-4 py-3"
            placeholder="Your name"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block font-medium">
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="w-full rounded-lg border px-4 py-3"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block font-medium">
            Password
          </label>

          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={8}
            className="w-full rounded-lg border px-4 py-3"
            placeholder="At least 8 characters"
          />
        </div>

        {error && (
          <p role="alert" className="rounded-lg bg-red-100 p-3 text-red-700">
            {error}
          </p>
        )}

        {success && (
          <p role="status" className="rounded-lg bg-green-100 p-3 text-green-700">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Creating Account..." : "Register"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-indigo-600"
        >
          Login
        </Link>
      </p>
    </main>
  );
}
