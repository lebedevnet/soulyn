import Link from "next/link";
import { signOutAction } from "@/app/actions";

type AppNavigationProps = {
  pathname: string;
};

const navigationItems = [
  { label: "Discover", href: "/discover" },
  { label: "Matches", href: "/matches" },
  { label: "Rooms", href: "/rooms" },
  { label: "Profile", href: "/profile" },
];

export default function AppNavigation({ pathname }: AppNavigationProps) {
  return (
    <nav className="mb-10 flex flex-wrap items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] p-2">
      <Link
        href="/"
        className="rounded-full px-4 py-2 text-sm font-medium text-white/55 transition hover:text-white"
      >
        Soulyn
      </Link>

      <div className="h-6 w-px bg-white/10" />

      {navigationItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              isActive
                ? "bg-white text-black"
                : "text-white/65 hover:bg-white/8 hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        );
      })}

      <div className="ml-auto" />

      <form action={signOutAction}>
        <button
          type="submit"
          className="rounded-full border border-white/12 px-4 py-2 text-sm font-medium text-white/70 transition hover:border-white/25 hover:text-white"
        >
          Log out
        </button>
      </form>
    </nav>
  );
}