
"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

function HeaderContent() {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function checkLogin() {
      setCheckingAuth(true);

      try {
        const response = await fetch("/api/auth/me", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!cancelled) {
          setUser(response.ok && data.user ? data.user : null);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setCheckingAuth(false);
        }
      }
    }

    checkLogin();

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  async function handleLogout() {
    setLoggingOut(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      setUser(null);
      router.replace("/");
      router.refresh();
    } catch {
      alert("Unable to log out. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <header className="border-b bg-white">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="text-2xl font-bold text-indigo-600">
          BlogSpace
        </Link>

        <div className="flex flex-wrap items-center gap-4">
          <Link href="/blogs" className="text-slate-700 hover:text-indigo-600">
            Blogs
          </Link>

          {checkingAuth ? (
            <span className="text-sm text-slate-500">
              Checking login...
            </span>
          ) : user ? (
            <>
              <Link
                href="/dashboard"
                className="text-slate-700 hover:text-indigo-600"
              >
                Dashboard
              </Link>

              <span className="text-sm text-slate-600">
                Hi, {user.name}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="rounded-lg bg-red-600 px-4 py-2 text-white disabled:opacity-50"
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-slate-700 hover:text-indigo-600"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-white"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default function Header() {
  return (
    <Suspense
      fallback={
        <header className="border-b bg-white">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-2xl font-bold text-indigo-600">
              BlogSpace
            </Link>
            <span className="text-sm text-slate-500">
              Loading navigation...
            </span>
          </nav>
        </header>
      }
    >
      <HeaderContent />
    </Suspense>
  );
}
