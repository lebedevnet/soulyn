"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeftIcon, SparkleIcon } from "@/components/icons";

type Status = "idle" | "loading" | "success" | "error";

export default function LoginPage() {
  const supabase = useMemo(() => createClient(), []);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setStatus("loading");
    setMessage("");

    const origin =
      typeof window !== "undefined" ? window.location.origin : "";

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }

    setStatus("success");
    setMessage(
      "Ссылка отправлена. Открой письмо от Supabase и нажми кнопку, чтобы войти.",
    );
    setEmail("");
  }

  return (
    <main className="min-h-[100svh]">
      <div className="mx-auto flex min-h-[100svh] max-w-5xl flex-col px-5 py-6 sm:px-8 sm:py-10">
        <header className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
          >
            <ArrowLeftIcon size={16} />
            На главную
          </Link>

          <Link
            href="/"
            className="flex items-center gap-2.5 text-sm font-semibold uppercase tracking-[0.22em]"
          >
            <span className="inline-block h-2 w-2 rounded-full bg-gradient-to-br from-violet-300 to-pink-400" />
            Soulyn
          </Link>
        </header>

        <section className="mt-12 grid flex-1 items-center gap-10 lg:mt-20 lg:grid-cols-[1fr_0.9fr]">
          <div className="max-w-xl">
            <span className="soul-chip soul-chip--accent">
              <SparkleIcon size={14} />
              Вход без пароля
            </span>

            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
              Войди в <span className="soul-gradient-text">Soulyn</span>
            </h1>

            <p className="mt-5 text-[16px] leading-7 text-white/65">
              Введи email — мы пришлём magic link. Никаких паролей, никаких
              лишних шагов. Подойдёт любой почтовый ящик, который ты проверяешь.
            </p>

            <ul className="mt-8 space-y-3 text-sm text-white/55">
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-violet-400" />
                Запрос одной ссылки — и Soulyn помнит тебя на всех устройствах.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-pink-400" />
                Никаких публичных профилей без твоего согласия.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Выйти можно в один клик из профиля.
              </li>
            </ul>
          </div>

          <div className="soul-surface p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-white/40">
              Magic link
            </p>
            <h2 className="mt-2 text-2xl font-semibold">Войти по email</h2>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs uppercase tracking-[0.18em] text-white/45"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                  className="soul-input"
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading" || !email}
                className="soul-btn soul-btn--primary w-full !py-3.5"
              >
                {status === "loading" ? "Отправляем…" : "Получить magic link"}
              </button>
            </form>

            {message ? (
              <div
                role="status"
                className={`mt-4 rounded-2xl border px-4 py-3 text-sm leading-6 ${
                  status === "error"
                    ? "border-red-500/30 bg-red-500/10 text-red-200"
                    : "border-emerald-500/25 bg-emerald-500/10 text-emerald-100"
                }`}
              >
                {message}
              </div>
            ) : (
              <p className="mt-4 text-xs text-white/40">
                Нажимая кнопку, ты соглашаешься получать входную ссылку и
                подтверждаешь, что тебе 18+.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
