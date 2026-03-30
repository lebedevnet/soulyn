import Link from "next/link";

export default function MatchesPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white sm:px-8 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/40">
              Soulyn
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              Matches
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/60">
              Здесь будут взаимные мэтчи, анонимные интро-чаты и переход в обычный
              диалог после mutual unlock.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-full border border-white/15 px-5 py-3 text-sm text-white/80 transition hover:border-white/30 hover:text-white"
          >
            Back to home
          </Link>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-white/45">Anonymous intro</p>
            <h2 className="mt-2 text-2xl font-semibold">First safe contact</h2>
            <p className="mt-4 text-white/60">
              На этом этапе пользователи сначала начинают общение без полного
              раскрытия профиля.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-white/45">Unlocked chat</p>
            <h2 className="mt-2 text-2xl font-semibold">Full conversation</h2>
            <p className="mt-4 text-white/60">
              После взаимного интереса здесь будет обычный чат с историей сообщений.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}