import { redirect } from "next/navigation";
import AppShell from "@/components/app-shell";
import DiscoverFeed from "@/components/discover-feed";
import { createClient } from "@/lib/supabase/server";

type DiscoverPageProps = {
  searchParams: Promise<{
    error?: string;
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

  const swipedProfileIds = Array.from(
    new Set((swipes ?? []).map((swipe) => swipe.target_profile_id)),
  );

  const currentUserName =
    profile.display_name ?? profile.username ?? user.email ?? "Soulyn user";

  return (
    <AppShell
      title="Discover"
      description="Здесь будет основная лента профилей с подбором по интересам, играм, вайбу и формату общения."
      pathname="/discover"
    >
      <div className="space-y-4">
        {params.error ? (
          <div className="rounded-[28px] border border-red-500/25 bg-red-500/10 p-5">
            <p className="text-sm text-red-200">{params.error}</p>
          </div>
        ) : null}

        <DiscoverFeed
          currentUserName={currentUserName}
          currentUserGames={profile.favorite_games ?? []}
          currentUserVibes={profile.vibe_tags ?? []}
          swipedProfileIds={swipedProfileIds}
        />
      </div>
    </AppShell>
  );
}