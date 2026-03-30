import Link from "next/link";

export default function DiscoverPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white sm:px-8 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/40">
              Soulyn
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              Discover
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/60">
              Здесь будет основная лента профилей с подбором по интересам, играм,
              вайбу и формату общения.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-full border border-white/15 px-5 py-3 text-sm text-white/80 transition hover:border-white/30 hover:text-white"
          >
            Back to home
          </Link>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-white/45">Main feed area</p>
            <h2 className="mt-2 text-2xl font-semibold">Profile recommendations</h2>
            <p className="mt-4 text-white/60">
              Тут позже будет карточка профиля, совместимость, интересы, игры,
              кнопки like / pass и быстрые действия.
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
              <p className="text-sm text-white/45">Filters</p>
              <p className="mt-2 text-white/60">
                Игры, цель знакомства, время онлайна, вайб, язык.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
              <p className="text-sm text-white/45">Matching logic</p>
              <p className="mt-2 text-white/60">
                Совпадение по интересам, активности и стилю общения.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}