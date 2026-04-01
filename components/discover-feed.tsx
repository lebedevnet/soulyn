"use client";

import { useMemo, useState, useTransition } from "react";
import { saveSwipeAction } from "@/app/discover/actions";
import { demoCandidates } from "@/lib/discover/demo-candidates";

type DiscoverFeedProps = {
  currentUserName: string;
  currentUserGames: string[];
  currentUserVibes: string[];
  swipedProfileIds: string[];
};

export default function DiscoverFeed({
  currentUserName,
  currentUserGames,
  currentUserVibes,
  swipedProfileIds,
}: DiscoverFeedProps) {
  const [likedCount, setLikedCount] = useState(0);
  const [passedCount, setPassedCount] = useState(0);
  const [isPending, startTransition] = useTransition();

  const availableCandidates = useMemo(() => {
    return demoCandidates.filter(
      (candidate) => !swipedProfileIds.includes(candidate.id),
    );
  }, [swipedProfileIds]);

  const currentCandidate = availableCandidates[0] ?? null;
  const remainingCount = availableCandidates.length;

  const summary = useMemo(() => {
    return {
      currentUserGames:
        currentUserGames.length > 0
          ? currentUserGames.join(", ")
          : "No games added yet",
      currentUserVibes:
        currentUserVibes.length > 0
          ? currentUserVibes.join(", ")
          : "No vibe tags added yet",
    };
  }, [currentUserGames, currentUserVibes]);

  function handleSwipe(direction: "like" | "pass") {
    if (!currentCandidate || isPending) {
      return;
    }

    if (direction === "like") {
      setLikedCount((value) => value + 1);
    } else {
      setPassedCount((value) => value + 1);
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append("target_profile_id", currentCandidate.id);
      formData.append("direction", direction);

      await saveSwipeAction(formData);
    });
  }

  function handleReset() {
    setLikedCount(0);
    setPassedCount(0);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-white/45">Discover feed</p>
            <h2 className="mt-2 text-2xl font-semibold">
              Profile recommendations
            </h2>
          </div>

          <div className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/65">
            {currentCandidate ? `${remainingCount} cards left` : "No cards left"}
          </div>
        </div>

        {currentCandidate ? (
          <div className="mt-6 rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm text-white/45">Suggested profile</p>
                <h3 className="mt-2 text-3xl font-semibold">
                  {currentCandidate.name}, {currentCandidate.age}
                </h3>
                <p className="mt-2 text-white/55">{currentCandidate.city}</p>
              </div>

              <div className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/75">
                {currentCandidate.compatibility}% compatibility
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-sm text-white/45">Looking for</p>
                <p className="mt-2 text-white/85">
                  {currentCandidate.lookingFor}
                </p>
              </div>

              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-sm text-white/45">Games</p>
                <p className="mt-2 text-white/85">
                  {currentCandidate.games.join(", ")}
                </p>
              </div>

              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-sm text-white/45">Vibe tags</p>
                <p className="mt-2 text-white/85">
                  {currentCandidate.vibeTags.join(", ")}
                </p>
              </div>

              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-sm text-white/45">Bio</p>
                <p className="mt-2 text-white/75">{currentCandidate.bio}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => handleSwipe("pass")}
                disabled={isPending}
                className="rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white/80 transition hover:border-white/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "Saving..." : "Pass"}
              </button>

              <button
                type="button"
                onClick={() => handleSwipe("like")}
                disabled={isPending}
                className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "Saving..." : "Like"}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-white/45">Queue finished</p>
            <h3 className="mt-2 text-2xl font-semibold">No more unseen profiles</h3>
            <p className="mt-3 max-w-xl text-white/60">
              You already swiped all demo profiles. Reset will only clear the local
              counters, but already swiped cards stay hidden because they are saved
              in the database.
            </p>

            <button
              type="button"
              onClick={handleReset}
              className="mt-6 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:opacity-90"
            >
              Reset local counters
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-white/45">Current user</p>
          <p className="mt-2 text-lg font-semibold">{currentUserName}</p>
          <p className="mt-3 text-sm leading-6 text-white/60">
            This panel uses your real profile data and will later affect matching.
          </p>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-white/45">Your games</p>
          <p className="mt-2 text-white/80">{summary.currentUserGames}</p>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-white/45">Your vibe tags</p>
          <p className="mt-2 text-white/80">{summary.currentUserVibes}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-white/45">Liked</p>
            <p className="mt-2 text-2xl font-semibold">{likedCount}</p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-white/45">Passed</p>
            <p className="mt-2 text-2xl font-semibold">{passedCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}