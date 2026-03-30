export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-between px-6 py-10 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between">
          <div className="text-xl font-semibold tracking-[0.2em] uppercase">
            Soulyn
          </div>

          <div className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/70">
            Early concept
          </div>
        </header>

        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-white/45">
              social discovery for gamers
            </p>

            <h1 className="max-w-4xl text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
              Find your person by vibe, not just by photo.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">
              Soulyn is a dating and social discovery platform for gamers,
              introverts, and online-first people who want a more comfortable
              way to meet, chat, and connect.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:opacity-90">
                Join waitlist
              </button>

              <button className="rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white/80 transition hover:border-white/30 hover:text-white">
                Explore concept
              </button>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-white/45">Preview card</p>
                <h2 className="mt-1 text-2xl font-semibold">Night owl match</h2>
              </div>

              <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">
                92% vibe match
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-sm text-white/45">Looking for</p>
                <p className="mt-1 text-base text-white">
                  late-night chat, duo games, and maybe something deeper
                </p>
              </div>

              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-sm text-white/45">Games</p>
                <p className="mt-1 text-base text-white">
                  Valorant, Minecraft, Genshin Impact
                </p>
              </div>

              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-sm text-white/45">Vibe</p>
                <p className="mt-1 text-base text-white">
                  introvert, ironic, comfort talk, soft energy
                </p>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>Built for online-first connection.</p>
          <p>Phase 1 — foundation</p>
        </footer>
      </section>
    </main>
  );
}