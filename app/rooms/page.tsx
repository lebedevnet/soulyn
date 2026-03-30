import AppShell from "@/components/app-shell";

export default function RoomsPage() {
  return (
    <AppShell
      title="Rooms"
      description="Здесь будут тематические комнаты по играм, фандомам, знакомству, вайбу и позднему онлайн-общению."
      pathname="/rooms"
    >
      <div className="grid gap-4 md:grid-cols-3">
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
    </AppShell>
  );
}