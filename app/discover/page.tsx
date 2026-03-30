import { redirect } from "next/navigation";
import AppShell from "@/components/app-shell";
import { createClient } from "@/lib/supabase/server";

function formatList(items: string[] | null | undefined, emptyText: string) {
  return items && items.length > 0 ? items.join(", ") : emptyText;
}

export default async function DiscoverPage() {
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
    .select("username, display_name, looking_for, favorite_games, vibe_tags, bio")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    redirect(`/profile?error=${encodeURIComponent(profileError.message)}`);
  }

  if (!profile) {
    redirect("/profile?setup=1");
  }

  const profileName =
    profile.display_name ?? profile.username ?? "Soulyn user";

  return (
    <AppShell
      title="Discover"
      description="Здесь будет основная лента профилей с подбором по интересам, играм, вайбу и формату общения."
      pathname="/discover"
    >
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6">
          <p className="text-sm text-white/45">Main feed area</p>
          <h2 className="mt-2 text-2xl font-semibold">
            Discover is now connected to your profile
          </h2>
          <p className="mt-4 text-white/60">
            Дальше здесь будет реальная лента анкет. Но уже сейчас экран читает
            твой профиль из базы и может использовать его как основу для
            рекомендаций и совместимости.
          </p>

          <div className="mt-6 rounded-2xl bg-white/5 p-4">
            <p className="text-sm text-white/45">Signed in as</p>
            <p className="mt-2 text-white/90">{user.email ?? "No email"}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-white/45">Profile summary</p>
            <p className="mt-2 text-lg font-semibold">{profileName}</p>
            <p className="mt-3 text-sm leading-6 text-white/60">
              {profile.bio ?? "No bio yet."}
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-white/45">Looking for</p>
            <p className="mt-2 text-white/80">
              {profile.looking_for ?? "Not set yet"}
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-white/45">Favorite games</p>
            <p className="mt-2 text-white/80">
              {formatList(profile.favorite_games, "No games added yet")}
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-white/45">Vibe tags</p>
            <p className="mt-2 text-white/80">
              {formatList(profile.vibe_tags, "No vibe tags yet")}
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}