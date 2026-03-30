import Link from "next/link";

export default function RoomsPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white sm:px-8 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/40">
              Soulyn
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              Rooms
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/60">
              Здесь будут тематические комнаты по играм, фандомам, знакомству,
              вайбу и позднему онлайн-общению.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-full border border-white/15 px-5 py-3 text-sm text-white/80 transition hover:border-white/30 hover:text-white"
          >
            Back to home
          </Link>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm text-white/45">Gaming</p>
            <p className="mt-2 text-lg font-semibold">Duo & co-op</p>
            <p className="mt-3 text-sm leading-6 text-white/60">
              Комнаты для поиска тиммейтов и общения вокруг конкретных игр.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm text-white/45">Vibe</p>
            <p className="mt-2 text-lg font-semibold">Night owls</p>
            <p className="mt-3 text-sm leading-6 text-white/60">
              Пространства для ночного общения, slow chat и мягких знакомств.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm text-white/45">Interest</p>
            <p className="mt-2 text-lg font-semibold">Fandom spaces</p>
            <p className="mt-3 text-sm leading-6 text-white/60">
              Аниме, музыка, мем-культура и общение вокруг общих интересов.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}