import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  CompassIcon,
  GamepadIcon,
  HeartIcon,
  MoonIcon,
  SparkleIcon,
  UsersIcon,
} from "@/components/icons";

const features = [
  {
    Icon: CompassIcon,
    title: "Discover по вайбу",
    text: "Лента профилей, подобранных по играм, интересам и формату общения — без шумных соревнований за внимание.",
  },
  {
    Icon: HeartIcon,
    title: "Mutual matches",
    text: "Симпатии анонимны. Как только она взаимная — открывается чат и можно не торопиться.",
  },
  {
    Icon: UsersIcon,
    title: "Тематические rooms",
    text: "Тихие комнаты по играм, фандомам и ночным онлайн-вайбам. Можно просто читать и вливаться в ритм.",
  },
  {
    Icon: MoonIcon,
    title: "Для интровертов",
    text: "Без звонков «сразу». Сначала текст, общие интересы, спокойный темп — потом всё остальное.",
  },
];

const previewTags = [
  "introvert",
  "night owl",
  "comfort talk",
  "duo queue",
  "memes",
  "deep talks",
];

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/discover");
  }

  return (
    <main className="min-h-[100svh] overflow-hidden">
      <div className="mx-auto flex min-h-[100svh] max-w-6xl flex-col px-5 py-6 sm:px-8 sm:py-10">
        <header className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-sm font-semibold uppercase tracking-[0.22em]"
          >
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-gradient-to-br from-violet-300 to-pink-400" />
            Soulyn
          </Link>

          <div className="flex items-center gap-2">
            <span className="hidden rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/55 sm:inline-flex">
              Early access · beta
            </span>

            <Link
              href="/login"
              className="soul-btn soul-btn--secondary !py-2 !px-4 text-[13px]"
            >
              Sign in
            </Link>
          </div>
        </header>

        <section className="mt-16 grid flex-1 items-center gap-12 md:mt-24 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <span className="soul-chip soul-chip--accent">
              <SparkleIcon size={14} />
              Social discovery для геймеров
            </span>

            <h1 className="mt-5 text-[44px] font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-[74px]">
              Найди своего
              <br />
              человека по{" "}
              <span className="soul-gradient-text">вайбу</span>,
              <br />
              а не по фото.
            </h1>

            <p className="mt-6 max-w-xl text-[16px] leading-7 text-white/65 sm:text-[17px]">
              Soulyn — dating и social discovery для геймеров, интровертов и
              online-first людей, которые хотят спокойный способ найти своих:
              по играм, интересам и ритму общения.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/login" className="soul-btn soul-btn--primary">
                Открыть приложение
                <SparkleIcon size={14} />
              </Link>

              <Link href="/login" className="soul-btn soul-btn--ghost">
                У меня уже есть аккаунт →
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-2">
              {previewTags.map((tag) => (
                <span key={tag} className="soul-chip">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-10 -z-10 rounded-[40px] bg-gradient-to-br from-violet-500/20 via-pink-500/10 to-transparent blur-3xl" />

            <div className="soul-surface relative overflow-hidden p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                    Preview
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold">Night owl match</h2>
                </div>

                <span className="soul-chip soul-chip--success">92% vibe</span>
              </div>

              <div className="mt-5 flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.025] p-4">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-violet-300 to-pink-400 text-center text-2xl font-semibold text-black/70 leading-[56px]">
                  M
                </div>
                <div>
                  <p className="text-base font-semibold">Mira, 22</p>
                  <p className="text-sm text-white/50">Sofia · late nights</p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <PreviewRow
                  label="Looking for"
                  value="late-night chat, duo games, maybe something deeper"
                />
                <PreviewRow label="Games" value="Valorant · Minecraft · Genshin Impact" />
                <PreviewRow label="Vibe" value="introvert · comfort talk · soft energy" />
              </div>

              <div className="mt-5 flex items-center gap-3">
                <button
                  type="button"
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                  disabled
                  aria-label="Pass"
                >
                  ✕
                </button>
                <button
                  type="button"
                  className="soul-btn soul-btn--primary flex-1 !py-3"
                  disabled
                >
                  <HeartIcon size={16} />
                  Like this vibe
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-20 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="soul-surface soul-surface-hover p-5 transition"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400/20 to-pink-400/20 text-white/80">
                <feature.Icon size={18} />
              </div>
              <p className="mt-4 text-base font-semibold">{feature.title}</p>
              <p className="mt-2 text-sm leading-6 text-white/55">
                {feature.text}
              </p>
            </div>
          ))}
        </section>

        <footer className="mt-20 flex flex-col gap-3 border-t border-white/5 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <GamepadIcon size={14} />
            <span>Soulyn · built for online-first connection</span>
          </div>
          <p>Phase 1 · foundation</p>
        </footer>
      </div>
    </main>
  );
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-white/[0.025] p-3">
      <span className="mt-0.5 rounded-full bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-widest text-white/45">
        {label}
      </span>
      <p className="text-sm leading-6 text-white/80">{value}</p>
    </div>
  );
}
