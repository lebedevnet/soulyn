import { redirect } from "next/navigation";
import AppShell from "@/components/app-shell";
import { createClient } from "@/lib/supabase/server";
import { saveProfileAction } from "@/app/profile/actions";

type ProfilePageProps = {
  searchParams: Promise<{
    saved?: string;
    error?: string;
    setup?: string;
  }>;
};

export default async function ProfilePage({
  searchParams,
}: ProfilePageProps) {
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
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <AppShell
      title="Profile"
      description="Здесь будет профиль пользователя: описание, интересы, игры, формат общения и настройки приватности."
      pathname="/profile"
    >
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6">
          <p className="text-sm text-white/45">Edit profile</p>
          <h2 className="mt-2 text-2xl font-semibold">
            {profile ? "Update your profile" : "Create your profile"}
          </h2>

          <form action={saveProfileAction} autoComplete="off" className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm text-white/55"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                autoComplete="off"
                defaultValue={profile?.username ?? ""}
                placeholder="nightowl"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-white/25"
              />
            </div>

            <div>
              <label
                htmlFor="display_name"
                className="mb-2 block text-sm text-white/55"
              >
                Display name
              </label>
              <input
                id="display_name"
                name="display_name"
                autoComplete="off"
                defaultValue={profile?.display_name ?? ""}
                placeholder="Night Owl"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-white/25"
              />
            </div>

            <div>
              <label
                htmlFor="looking_for"
                className="mb-2 block text-sm text-white/55"
              >
                Looking for
              </label>
              <input
                id="looking_for"
                name="looking_for"
                autoComplete="off"
                defaultValue={profile?.looking_for ?? ""}
                placeholder="late-night chat, duo games, relationship"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-white/25"
              />
            </div>

            <div>
              <label
                htmlFor="favorite_games"
                className="mb-2 block text-sm text-white/55"
              >
                Favorite games
              </label>
              <input
                id="favorite_games"
                name="favorite_games"
                autoComplete="off"
                defaultValue={profile?.favorite_games?.join(", ") ?? ""}
                placeholder="Valorant, Minecraft, Genshin Impact"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-white/25"
              />
            </div>

            <div>
              <label
                htmlFor="vibe_tags"
                className="mb-2 block text-sm text-white/55"
              >
                Vibe tags
              </label>
              <input
                id="vibe_tags"
                name="vibe_tags"
                autoComplete="off"
                defaultValue={profile?.vibe_tags?.join(", ") ?? ""}
                placeholder="introvert, ironic, comfort talk, soft energy"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-white/25"
              />
            </div>

            <div>
              <label
                htmlFor="bio"
                className="mb-2 block text-sm text-white/55"
              >
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                autoComplete="off"
                defaultValue={profile?.bio ?? ""}
                placeholder="A few words about yourself, your vibe, and how you like to communicate."
                rows={5}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-white/25"
              />
            </div>

            <button
              type="submit"
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:opacity-90"
            >
              {profile ? "Save changes" : "Create profile"}
            </button>
          </form>
        </div>

        <div className="space-y-4">
          {params.setup ? (
            <div className="rounded-[28px] border border-amber-500/25 bg-amber-500/10 p-5">
              <p className="text-sm text-amber-200">
                Complete your profile first to unlock Discover.
              </p>
            </div>
          ) : null}

          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-white/45">Account</p>
            <p className="mt-2 text-white/80">{user.email ?? "No email"}</p>
            <p className="mt-3 text-sm leading-6 text-white/60">
              Текущий авторизованный пользователь.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-white/45">Profile record</p>
            <p className="mt-2 text-white/80">
              {profile ? "Exists in database" : "Not created yet"}
            </p>
            <p className="mt-3 text-sm leading-6 text-white/60">
              После первого сохранения запись появится в таблице profiles.
            </p>
          </div>

          {params.saved ? (
            <div className="rounded-[28px] border border-emerald-500/25 bg-emerald-500/10 p-5">
              <p className="text-sm text-emerald-200">Profile saved successfully.</p>
            </div>
          ) : null}

          {params.error ? (
            <div className="rounded-[28px] border border-red-500/25 bg-red-500/10 p-5">
              <p className="text-sm text-red-200">{params.error}</p>
            </div>
          ) : null}

          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-white/45">Database status</p>
            <p className="mt-2 text-white/80">
              {profileError
                ? `Error: ${profileError.message}`
                : profile
                  ? "Profile row loaded successfully."
                  : "No profile row found yet."}
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}