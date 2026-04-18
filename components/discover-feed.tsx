"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { resetSwipesAction, saveSwipeAction } from "@/app/discover/actions";
import {
  demoCandidates,
  type DiscoverCandidate,
} from "@/lib/discover/demo-candidates";
import Avatar from "@/components/avatar";
import {
  CloseIcon,
  HeartSolidIcon,
  SparkleIcon,
} from "@/components/icons";

type DiscoverFeedProps = {
  currentUserGames: string[];
  currentUserVibes: string[];
  swipedProfileIds: string[];
};

type SwipeDirection = "like" | "pass";

function onlineLabel(online: DiscoverCandidate["online"]) {
  switch (online) {
    case "online":
      return { text: "online", color: "bg-emerald-400" };
    case "night":
      return { text: "night owl", color: "bg-violet-400" };
    default:
      return { text: "offline", color: "bg-white/30" };
  }
}

export default function DiscoverFeed({
  currentUserGames,
  currentUserVibes,
  swipedProfileIds,
}: DiscoverFeedProps) {
  const [likedCount, setLikedCount] = useState(0);
  const [passedCount, setPassedCount] = useState(0);
  const [animatingDirection, setAnimatingDirection] =
    useState<SwipeDirection | null>(null);
  const [isPending, startTransition] = useTransition();

  const availableCandidates = useMemo(() => {
    return demoCandidates.filter(
      (candidate) => !swipedProfileIds.includes(candidate.id),
    );
  }, [swipedProfileIds]);

  const currentCandidate = availableCandidates[0] ?? null;
  const nextCandidate = availableCandidates[1] ?? null;

  const sharedGames = useMemo(() => {
    if (!currentCandidate) {
      return [] as string[];
    }

    const mine = new Set(currentUserGames.map((game) => game.toLowerCase()));
    return currentCandidate.games.filter((game) =>
      mine.has(game.toLowerCase()),
    );
  }, [currentCandidate, currentUserGames]);

  const sharedVibes = useMemo(() => {
    if (!currentCandidate) {
      return [] as string[];
    }

    const mine = new Set(currentUserVibes.map((vibe) => vibe.toLowerCase()));
    return currentCandidate.vibeTags.filter((vibe) =>
      mine.has(vibe.toLowerCase()),
    );
  }, [currentCandidate, currentUserVibes]);

  const handleSwipe = useMemo(() => {
    return (direction: SwipeDirection) => {
      if (!currentCandidate || isPending || animatingDirection) {
        return;
      }

      setAnimatingDirection(direction);

      if (direction === "like") {
        setLikedCount((value) => value + 1);
      } else {
        setPassedCount((value) => value + 1);
      }

      const profileId = currentCandidate.id;

      startTransition(async () => {
        const formData = new FormData();
        formData.append("target_profile_id", profileId);
        formData.append("direction", direction);

        await saveSwipeAction(formData);
      });

      window.setTimeout(() => {
        setAnimatingDirection(null);
      }, 350);
    };
  }, [animatingDirection, currentCandidate, isPending, startTransition]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        handleSwipe("pass");
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        handleSwipe("like");
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSwipe]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
      <div className="relative">
        <div className="relative h-[min(680px,calc(100svh-260px))] min-h-[520px]">
          {nextCandidate ? (
            <CandidateCard
              candidate={nextCandidate}
              stacked
              key={`next-${nextCandidate.id}`}
            />
          ) : null}

          {currentCandidate ? (
            <CandidateCard
              key={currentCandidate.id}
              candidate={currentCandidate}
              sharedGames={sharedGames}
              sharedVibes={sharedVibes}
              animatingDirection={animatingDirection}
            />
          ) : (
            <EmptyQueue />
          )}
        </div>

        {currentCandidate ? (
          <div className="mt-6 flex items-center justify-center gap-5">
            <SwipeButton
              direction="pass"
              onClick={() => handleSwipe("pass")}
              disabled={isPending || Boolean(animatingDirection)}
            />

            <div className="text-center text-[11px] uppercase tracking-[0.24em] text-white/35">
              <div>swipe</div>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="soul-kbd">←</span>
                <span>/</span>
                <span className="soul-kbd">→</span>
              </div>
            </div>

            <SwipeButton
              direction="like"
              onClick={() => handleSwipe("like")}
              disabled={isPending || Boolean(animatingDirection)}
            />
          </div>
        ) : null}
      </div>

      <aside className="space-y-4">
        <div className="soul-surface p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-white/40">
            Сессия
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <SessionStat label="Liked" value={likedCount} tone="accent" />
            <SessionStat label="Passed" value={passedCount} tone="neutral" />
          </div>
          <p className="mt-4 text-[11px] leading-5 text-white/40">
            Симпатии анонимны до взаимности. Mutual match появляется в Matches.
          </p>
        </div>

        <div className="soul-surface p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-white/40">
            Твой вайб
          </p>

          <div className="mt-3">
            <p className="text-[11px] uppercase tracking-widest text-white/35">
              Игры
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {currentUserGames.length > 0 ? (
                currentUserGames.map((game) => (
                  <span key={game} className="soul-chip">
                    {game}
                  </span>
                ))
              ) : (
                <span className="text-sm text-white/50">
                  Пока нет игр — добавь в профиле.
                </span>
              )}
            </div>
          </div>

          <div className="mt-4">
            <p className="text-[11px] uppercase tracking-widest text-white/35">
              Вайб
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {currentUserVibes.length > 0 ? (
                currentUserVibes.map((vibe) => (
                  <span key={vibe} className="soul-chip soul-chip--accent">
                    {vibe}
                  </span>
                ))
              ) : (
                <span className="text-sm text-white/50">
                  Добавь теги вайба в профиле, чтобы подбор стал точнее.
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="soul-surface p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-white/40">
            Очередь
          </p>
          <p className="mt-2 text-2xl font-semibold">
            {availableCandidates.length}
          </p>
          <p className="mt-1 text-sm text-white/55">
            осталось карточек в демо-наборе
          </p>

          <form action={resetSwipesAction} className="mt-4">
            <button type="submit" className="soul-btn soul-btn--secondary w-full">
              Сбросить свайпы и чаты
            </button>
          </form>
          <p className="mt-2 text-[11px] text-white/40">
            Удалит все свайпы, мэтчи и сообщения — удобно для тестов.
          </p>
        </div>
      </aside>
    </div>
  );
}

type CandidateCardProps = {
  candidate: DiscoverCandidate;
  sharedGames?: string[];
  sharedVibes?: string[];
  animatingDirection?: SwipeDirection | null;
  stacked?: boolean;
};

function CandidateCard({
  candidate,
  sharedGames = [],
  sharedVibes = [],
  animatingDirection,
  stacked = false,
}: CandidateCardProps) {
  const animationClass = animatingDirection
    ? animatingDirection === "like"
      ? "soul-swipe-out-right"
      : "soul-swipe-out-left"
    : "";

  const status = onlineLabel(candidate.online);

  return (
    <article
      className={`absolute inset-0 overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-[#131022] via-[#0c0b17] to-[#080810] p-6 shadow-[0_40px_80px_-40px_rgba(167,139,250,0.45)] transition ${
        stacked
          ? "scale-[0.97] opacity-60 translate-y-2"
          : "soul-fade-in"
      } ${animationClass}`}
      style={
        stacked ? { filter: "blur(0.4px)", pointerEvents: "none" } : undefined
      }
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar name={candidate.name} size={72} />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-semibold">
                {candidate.name}, {candidate.age}
              </h2>
              {candidate.likedYou ? (
                <span className="soul-chip soul-chip--success !text-[10px] !px-2 !py-0.5">
                  likes you
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-sm text-white/55">
              {candidate.city}
              {candidate.pronouns ? ` · ${candidate.pronouns}` : ""}
            </p>
            <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-white/60">
              <span className={`inline-block h-1.5 w-1.5 rounded-full ${status.color}`} />
              {status.text}
            </div>
          </div>
        </div>

        <span className="soul-chip soul-chip--accent flex-col items-center gap-0 text-center leading-none">
          <span className="text-lg font-semibold leading-none">
            {candidate.compatibility}%
          </span>
          <span className="mt-1 text-[10px] uppercase tracking-widest">vibe</span>
        </span>
      </div>

      <div className="mt-5 space-y-3 overflow-y-auto pr-1" style={{ maxHeight: "calc(100% - 140px)" }}>
        <InfoBlock label="Looking for">{candidate.lookingFor}</InfoBlock>

        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
          <p className="text-[11px] uppercase tracking-widest text-white/40">
            Games
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {candidate.games.map((game) => {
              const shared = sharedGames.some(
                (item) => item.toLowerCase() === game.toLowerCase(),
              );

              return (
                <span
                  key={game}
                  className={`soul-chip ${shared ? "soul-chip--accent" : ""}`}
                >
                  {shared ? <SparkleIcon size={12} /> : null}
                  {game}
                </span>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
          <p className="text-[11px] uppercase tracking-widest text-white/40">
            Vibe
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {candidate.vibeTags.map((vibe) => {
              const shared = sharedVibes.some(
                (item) => item.toLowerCase() === vibe.toLowerCase(),
              );

              return (
                <span
                  key={vibe}
                  className={`soul-chip ${shared ? "soul-chip--accent" : ""}`}
                >
                  {vibe}
                </span>
              );
            })}
          </div>
        </div>

        {candidate.prompt ? (
          <div className="rounded-2xl border border-violet-400/20 bg-violet-400/[0.06] p-4">
            <p className="text-[11px] uppercase tracking-widest text-violet-200/70">
              {candidate.prompt.question}
            </p>
            <p className="mt-2 text-[15px] leading-6 text-white/85">
              &laquo;{candidate.prompt.answer}&raquo;
            </p>
          </div>
        ) : null}

        <InfoBlock label="Bio">{candidate.bio}</InfoBlock>
      </div>
    </article>
  );
}

function InfoBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
      <p className="text-[11px] uppercase tracking-widest text-white/40">
        {label}
      </p>
      <p className="mt-2 text-sm leading-6 text-white/85">{children}</p>
    </div>
  );
}

function SwipeButton({
  direction,
  onClick,
  disabled,
}: {
  direction: SwipeDirection;
  onClick: () => void;
  disabled?: boolean;
}) {
  if (direction === "like") {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-pink-400 text-black shadow-[0_20px_40px_-15px_rgba(244,114,182,0.55)] transition hover:scale-[1.03] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        aria-label="Like"
      >
        <HeartSolidIcon size={26} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition hover:border-white/20 hover:bg-white/10 hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
      aria-label="Pass"
    >
      <CloseIcon size={22} />
    </button>
  );
}

function SessionStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "accent" | "neutral";
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        tone === "accent"
          ? "border-violet-400/20 bg-violet-400/[0.06]"
          : "border-white/5 bg-white/[0.03]"
      }`}
    >
      <p className="text-[11px] uppercase tracking-widest text-white/40">
        {label}
      </p>
      <p
        className={`mt-1 text-2xl font-semibold ${
          tone === "accent" ? "text-violet-100" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function EmptyQueue() {
  return (
    <div className="absolute inset-0 flex items-center justify-center rounded-[28px] border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
      <div>
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-400/30 to-pink-400/30 text-white">
          <SparkleIcon size={22} />
        </div>
        <h3 className="mt-4 text-xl font-semibold">Очередь закончилась</h3>
        <p className="mt-2 max-w-sm text-sm leading-6 text-white/55">
          Ты просмотрел(а) все демо-профили. Новые профили появятся, когда в
          Soulyn подключатся настоящие пользователи — или сбрось свайпы справа,
          чтобы поиграть с демо-картами ещё раз.
        </p>
      </div>
    </div>
  );
}
