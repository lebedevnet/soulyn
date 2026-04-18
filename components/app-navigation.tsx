import Link from "next/link";
import {
  CompassIcon,
  HeartIcon,
  LogoutIcon,
  UserIcon,
  UsersIcon,
} from "@/components/icons";
import { signOutAction } from "@/app/actions";

type AppNavigationProps = {
  pathname: string;
  unreadMatches?: number;
  userLabel?: string;
};

const navigationItems = [
  { label: "Discover", href: "/discover", Icon: CompassIcon },
  { label: "Matches", href: "/matches", Icon: HeartIcon },
  { label: "Rooms", href: "/rooms", Icon: UsersIcon },
  { label: "Profile", href: "/profile", Icon: UserIcon },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/matches") {
    return pathname === "/matches" || pathname.startsWith("/matches/");
  }

  if (href === "/rooms") {
    return pathname === "/rooms" || pathname.startsWith("/rooms/");
  }

  return pathname === href;
}

export default function AppNavigation({
  pathname,
  unreadMatches = 0,
  userLabel,
}: AppNavigationProps) {
  return (
    <>
      {/* Desktop top navigation */}
      <header className="sticky top-0 z-30 hidden border-b border-white/5 bg-black/40 backdrop-blur-xl md:block">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-[15px] font-semibold tracking-[0.16em]"
          >
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-gradient-to-br from-violet-300 to-pink-400" />
            <span className="uppercase">Soulyn</span>
          </Link>

          <nav className="flex items-center gap-1 rounded-full border border-white/5 bg-white/[0.03] p-1">
            {navigationItems.map((item) => {
              const active = isActivePath(pathname, item.href);
              const showBadge =
                item.href === "/matches" && unreadMatches > 0;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${
                    active
                      ? "bg-white/10 text-white"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  <item.Icon size={16} />
                  {item.label}
                  {showBadge ? (
                    <span className="ml-1 inline-flex min-w-[18px] justify-center rounded-full bg-gradient-to-br from-violet-400 to-pink-400 px-1.5 text-[11px] font-semibold text-black/80">
                      {unreadMatches > 9 ? "9+" : unreadMatches}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {userLabel ? (
              <span className="hidden text-sm text-white/55 lg:inline">
                {userLabel}
              </span>
            ) : null}

            <form action={signOutAction}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/70 transition hover:border-white/20 hover:text-white"
                aria-label="Sign out"
              >
                <LogoutIcon size={16} />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-white/5 bg-black/60 px-4 backdrop-blur-xl md:hidden">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold tracking-[0.18em] uppercase"
        >
          <span className="inline-block h-2 w-2 rounded-full bg-gradient-to-br from-violet-300 to-pink-400" />
          Soulyn
        </Link>

        <form action={signOutAction}>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.03] p-2 text-white/70 transition hover:text-white"
            aria-label="Sign out"
          >
            <LogoutIcon size={16} />
          </button>
        </form>
      </header>

      {/* Mobile bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/5 bg-black/70 backdrop-blur-xl md:hidden">
        <div className="mx-auto flex max-w-xl items-center justify-around px-2 pb-[env(safe-area-inset-bottom)]">
          {navigationItems.map((item) => {
            const active = isActivePath(pathname, item.href);
            const showBadge =
              item.href === "/matches" && unreadMatches > 0;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] transition ${
                  active ? "text-white" : "text-white/50"
                }`}
              >
                <item.Icon size={22} />
                <span>{item.label}</span>
                {active ? (
                  <span className="absolute top-0 h-[2px] w-8 rounded-full bg-gradient-to-r from-violet-300 to-pink-400" />
                ) : null}
                {showBadge ? (
                  <span className="absolute right-[calc(50%-22px)] top-1.5 min-w-[16px] rounded-full bg-gradient-to-br from-violet-400 to-pink-400 px-1 text-[10px] font-semibold text-black/80">
                    {unreadMatches > 9 ? "9+" : unreadMatches}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
