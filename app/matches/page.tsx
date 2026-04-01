import Link from "next/link";
import { redirect } from "next/navigation";
import AppShell from "@/components/app-shell";
import { createClient } from "@/lib/supabase/server";
import {
  demoCandidates,
  type DiscoverCandidate,
} from "@/lib/discover/demo-candidates";

type CandidateCard = DiscoverCandidate & {
  createdAt: string;
};

export default async function MatchesPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: matches, error: matchesError } = await supabase
    .from("matches")
    .select("target_profile_id, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (matchesError) {
    redirect(`/discover?error=${encodeURIComponent(matchesError.message)}`);
  }

  const { data: swipes, error: swipesError } = await supabase
    .from("swipes")
    .select("target_profile_id, direction, created_at")
    .eq("user_id", user.id)
    .eq("direction", "like")
    .order("created_at", { ascending: false });

  if (swipesError) {
    redirect(`/discover?error=${encodeURIComponent(swipesError.message)}`);
  }

  const matchMap = new Map<string, string>();

  for (const match of matches ?? []) {
    if (!matchMap.has(match.target_profile_id)) {
      matchMap.set(match.target_profile_id, match.created_at);
    }
  }

  const realMatches: CandidateCard[] = Array.from(matchMap.entries()).reduce<
    CandidateCard[]
  >((result, [targetProfileId, createdAt]) => {
    const candidate = demoCandidates.find((item) => item.id === targetProfileId);

    if (!candidate) {
      return result;
    }

    result.push({
      ...candidate,
      createdAt,
    });

    return result;
  }, []);

  const realMatchIds = new Set(realMatches.map((item) => item.id));

  const latestLikedSwipeByProfile = new Map<string, string>();

  for (const swipe of swipes ?? []) {
    if (!latestLikedSwipeByProfile.has(swipe.target_profile_id)) {
      latestLikedSwipeByProfile.set(swipe.target_profile_id, swipe.created_at);
    }
  }

  const pendingLikes: CandidateCard[] = Array.from(
    latestLikedSwipeByProfile.entries(),
  ).reduce<CandidateCard[]>((result, [targetProfileId, createdAt]) => {
    if (realMatchIds.has(targetProfileId)) {
      return result;
    }

    const candidate = demoCandidates.find((item) => item.id === targetProfileId);

    if (!candidate) {
      return result;
    }

    result.push({
      ...candidate,
      createdAt,
    });

    return result;
  }, []);

  return (
    <AppShell
      title="Matches"
      description="Здесь будут взаимные мэтчи, анонимные интро-чаты и переход в обычный диалог после mutual unlock."
      pathname="/matches"
    >
      <div className="space-y-6">
        <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-white/45">Current stage</p>
          <p className="mt-2 text-white/80">
            Теперь страница разделена на two sections: real matches и liked profiles without mutual match.
          </p>
        </div>

        <section className="space-y-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/40">
              Real matches
            </p>
            <h2 className="mt-2 text-3xl font-semibold">Mutual connection</h2>
          </div>

          {realMatches.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {realMatches.map((profile) => (
                <div
                  key={profile.id}
                  className="rounded-[28px] border border-emerald-500/20 bg-emerald-500/5 p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-emerald-200/80">Mutual match</p>
                      <h3 className="mt-2 text-2xl font-semibold">
                        {profile.name}, {profile.age}
                      </h3>
                      <p className="mt-2 text-white/55">{profile.city}</p>
                    </div>

                    <div className="rounded-full border border-emerald-400/20 px-3 py-1 text-xs text-emerald-200/80">
                      It&apos;s a match
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    <div className="rounded-2xl bg-white/5 p-4">
                      <p className="text-sm text-white/45">Looking for</p>
                      <p className="mt-2 text-white/85">{profile.lookingFor}</p>
                    </div>

                    <div className="rounded-2xl bg-white/5 p-4">
                      <p className="text-sm text-white/45">Games</p>
                      <p className="mt-2 text-white/85">{profile.games.join(", ")}</p>
                    </div>

                    <div className="rounded-2xl bg-white/5 p-4">
                      <p className="text-sm text-white/45">Vibe tags</p>
                      <p className="mt-2 text-white/85">
                        {profile.vibeTags.join(", ")}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white/5 p-4">
                      <p className="text-sm text-white/45">Matched at</p>
                      <p className="mt-2 text-white/75">
                        {new Date(profile.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/matches/${profile.id}`}
                    className="mt-6 inline-flex rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:opacity-90"
                  >
                    Open chat
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
              <p className="text-sm text-white/45">No matches yet</p>
              <h3 className="mt-2 text-2xl font-semibold">
                Mutual matches will appear here
              </h3>
              <p className="mt-4 max-w-2xl text-white/60">
                In this demo version, some profiles already like you back. When you like
                them, they move into the real matches section.
              </p>
            </div>
          )}
        </section>

        <section className="space-y-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/40">
              Pending likes
            </p>
            <h2 className="mt-2 text-3xl font-semibold">Liked by you</h2>
          </div>

          {pendingLikes.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {pendingLikes.map((profile) => (
                <div
                  key={profile.id}
                  className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-white/45">Liked profile</p>
                      <h3 className="mt-2 text-2xl font-semibold">
                        {profile.name}, {profile.age}
                      </h3>
                      <p className="mt-2 text-white/55">{profile.city}</p>
                    </div>

                    <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/65">
                      Waiting
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    <div className="rounded-2xl bg-white/5 p-4">
                      <p className="text-sm text-white/45">Looking for</p>
                      <p className="mt-2 text-white/85">{profile.lookingFor}</p>
                    </div>

                    <div className="rounded-2xl bg-white/5 p-4">
                      <p className="text-sm text-white/45">Games</p>
                      <p className="mt-2 text-white/85">{profile.games.join(", ")}</p>
                    </div>

                    <div className="rounded-2xl bg-white/5 p-4">
                      <p className="text-sm text-white/45">Vibe tags</p>
                      <p className="mt-2 text-white/85">
                        {profile.vibeTags.join(", ")}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white/5 p-4">
                      <p className="text-sm text-white/45">Liked at</p>
                      <p className="mt-2 text-white/75">
                        {new Date(profile.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
              <p className="text-sm text-white/45">No pending likes</p>
              <h3 className="mt-2 text-2xl font-semibold">
                Profiles you like without a mutual match will appear here
              </h3>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}