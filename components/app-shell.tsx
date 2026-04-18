import type { ReactNode } from "react";
import AppNavigation from "@/components/app-navigation";

type AppShellProps = {
  pathname: string;
  children: ReactNode;
  unreadMatches?: number;
  userLabel?: string;
  contentClassName?: string;
};

export default function AppShell({
  pathname,
  children,
  unreadMatches,
  userLabel,
  contentClassName = "",
}: AppShellProps) {
  return (
    <div className="min-h-[100svh] pb-20 md:pb-0">
      <AppNavigation
        pathname={pathname}
        unreadMatches={unreadMatches}
        userLabel={userLabel}
      />

      <main
        className={`mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 md:py-10 ${contentClassName}`}
      >
        {children}
      </main>
    </div>
  );
}

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-white/40">
            {eyebrow}
          </p>
        ) : null}

        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h1>

        {description ? (
          <p className="mt-3 text-[15px] leading-relaxed text-white/60">
            {description}
          </p>
        ) : null}
      </div>

      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}
