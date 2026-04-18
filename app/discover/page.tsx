import { redirect } from "next/navigation";
import AppShell, { PageHeader } from "@/components/app-shell";
import DiscoverFeed from "@/components/discover-feed";
import { createClient } from "@/lib/supabase/server";

type DiscoverPageProps = {
  searchParams: Promise<{
    error?: string;
    reset?: string;
  }>;
};

export default async function DiscoverPage({
  searchParams,
}: DiscoverPageProps) {
  const params = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("username, display_name, favorite_games, vibe_tags")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    redirect(`/profile?error=${encodeURIComponent(profileError.message)}`);
  }

  if (!profile) {
    redirect("/profile?setup=1");
  }

  const { data: swipes, error: swipesError } = await supabase
    .from("swipes")
    .select("target_profile_id")
    .eq("user_id", user.id);

  if (swipesError) {
    redirect(`/discover?error=${encodeURIComponent(swipesError.message)}`);
  }

  const { data: matches } = await supabase
    .from("matches")
    .select("target_profile_id, last_read_at")
    .eq("user_id", user.id);

  const { data: latestMessages } = await supabase
    .from("messages")
    .select("target_profile_id, sender, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const latestByProfile = new Map<
    string,
    { sender: "me" | "them"; createdAt: string }
  >();

  for (const message of latestMessages ?? []) {
    if (!latestByProfile.has(message.target_profile_id)) {
      latestByProfile.set(message.target_profile_id, {
        sender: message.sender,
        createdAt: message.created_at,
      });
    }
  }

  let unreadMatches = 0;

  for (const match of matches ?? []) {
    const latest = latestByProfile.get(match.target_profile_id);

    if (!latest || latest.sender !== "them") {
      continue;
    }

    if (
      !match.last_read_at ||
      new Date(latest.createdAt).getTime() >
        new Date(match.last_read_at).getTime()
    ) {
      unreadMatches += 1;
    }
  }

  const swipedProfileIds = Array.from(
    new Set((swipes ?? []).map((swipe) => swipe.target_profile_id)),
  );

  const userLabel =
    profile.display_name ?? profile.username ?? user.email ?? undefined;

  return (
    <AppShell
      pathname="/discover"
      unreadMatches={unreadMatches}
      userLabel={userLabel}
    >
      <PageHeader
        eyebrow="Discover"
        title="Люди по вайбу"
        description="Выбирай тех, с кем совпадает ритм. Свайпай влево, чтобы пропустить, и вправо, если вайб ваш."
      />

      {params.reset ? (
        <div className="mb-4 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
          Свайпы, мэтчи и сообщения сброшены. Можно начинать заново.
        </div>
      ) : null}

      {params.error ? (
        <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {params.error}
        </div>
      ) : null}

      <DiscoverFeed
        currentUserGames={profile.favorite_games ?? []}
        currentUserVibes={profile.vibe_tags ?? []}
        swipedProfileIds={swipedProfileIds}
      />
    </AppShell>
  );
}
