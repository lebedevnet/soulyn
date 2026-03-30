import type { ReactNode } from "react";
import Link from "next/link";
import AppNavigation from "@/components/app-navigation";

type AppShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export default function AppShell({
  title,
  description,
  children,
}: AppShellProps) {
  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white sm:px-8 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <AppNavigation />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/40">
              Soulyn
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              {title}
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-white/60">
              {description}
            </p>
          </div>

          <Link
            href="/"
            className="rounded-full border border-white/15 px-5 py-3 text-sm text-white/80 transition hover:border-white/30 hover:text-white"
          >
            Back to home
          </Link>
        </div>

        <div className="mt-10">{children}</div>
      </div>
    </main>
  );
}