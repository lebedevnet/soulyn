"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = useMemo(() => createClient(), []);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setStatus("loading");
    setMessage("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: "http://localhost:3000/auth/callback",
      },
    });

    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }

    setStatus("success");
    setMessage("Magic link sent. Check your email.");
    setEmail("");
  }

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white sm:px-8 lg:px-10">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col">
        <div className="mb-10 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-semibold uppercase tracking-[0.2em]"
          >
            Soulyn
          </Link>

          <Link
            href="/"
            className="rounded-full border border-white/15 px-5 py-3 text-sm text-white/80 transition hover:border-white/30 hover:text-white"
          >
            Back to home
          </Link>
        </div>

        <div className="grid flex-1 items-center gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.3em] text-white/40">
              access
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              Sign in to Soulyn
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-white/60">
              For the first version, we use a simple email magic link. No password,
              no complicated setup.
            </p>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-white/45">Login</p>
            <h2 className="mt-2 text-2xl font-semibold">Continue with email</h2>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm text-white/55"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-white/25"
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "loading" ? "Sending..." : "Send magic link"}
              </button>
            </form>

            {message ? (
              <div
                className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${
                  status === "error"
                    ? "border-red-500/30 bg-red-500/10 text-red-200"
                    : "border-white/10 bg-white/5 text-white/75"
                }`}
              >
                {message}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}