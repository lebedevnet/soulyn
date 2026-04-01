import { redirect } from "next/navigation";
import AppShell from "@/components/app-shell";
import { createClient } from "@/lib/supabase/server";
import {
  demoCandidates,
  type DiscoverCandidate,
} from "@/lib/discover/demo-candidates";

type LikedProfile = DiscoverCandidate & {
  likedAt: string;
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

  const { data: swipes, error: swipesError } = await supabase
    .from("swipes")
    .select("target_profile_id, direction, created_at")
    .eq("user_id", user.id)
    .eq("direction", "like")
    .order("created_at", { ascending: false });

  if (swipesError) {
    redirect(`/discover?error=${encodeURIComponent(swipesError.message)}`);
  }

  const latestSwipeByProfile = new Map<string, string>();

  for (const swipe of swipes ?? []) {
    if (!latestSwipeByProfile.has(swipe.target_profile_id)) {
      latestSwipeByProfile.set(swipe.target_profile_id, swipe.created_at);
    }
  }

  const likedProfiles: LikedProfile[] = Array.from(
    latestSwipeByProfile.entries(),
  ).reduce<LikedProfile[]>((result, [targetProfileId, likedAt]) => {
    const candidate = demoCandidates.find((item) => item.id === targetProfileId);

    if (!candidate) {
      return result;
    }

    result.push({
      ...candidate,
      likedAt,
    });

    return result;
  }, []);

  return (
    <AppShell
      title="Matches"
      description="Здесь будут взаимные мэтчи, анонимные интро-чаты и переход в обычный диалог после mutual unlock."
      pathname="/matches"
    >
      <div className="space-y-4">
        <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-white/45">Current stage</p>
          <p className="mt-2 text-white/80">
            Пока это не mutual matches, а список профилей, которым ты уже поставил like.
          </p>
        </div>

        {likedProfiles.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {likedProfiles.map((profile) => (
              <div
                key={profile.id}
                className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-white/45">Liked profile</p>
                    <h2 className="mt-2 text-2xl font-semibold">
                      {profile.name}, {profile.age}
                    </h2>
                    <p className="mt-2 text-white/55">{profile.city}</p>
                  </div>

                  <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/65">
                    {profile.compatibility}% compatibility
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
                    <p className="text-sm text-white/45">Bio</p>
                    <p className="mt-2 text-white/75">{profile.bio}</p>
                  </div>

                  <div className="rounded-2xl bg-white/5 p-4">
                    <p className="text-sm text-white/45">Last liked at</p>
                    <p className="mt-2 text-white/75">
                      {new Date(profile.likedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-white/45">No likes yet</p>
            <h2 className="mt-2 text-2xl font-semibold">
              Your liked profiles will appear here
            </h2>
            <p className="mt-4 max-w-2xl text-white/60">
              Go to Discover and press Like on a few profiles. After that, they will
              show up on this page.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}