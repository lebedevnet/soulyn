import { redirect } from "next/navigation";
import AppShell from "@/components/app-shell";
import { createClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
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
    >
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6">
          <p className="text-sm text-white/45">Account</p>
          <h2 className="mt-2 text-2xl font-semibold">Current user</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-sm text-white/45">User ID</p>
              <p className="mt-2 break-all text-sm text-white/80">{user.id}</p>
            </div>

            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-sm text-white/45">Email</p>
              <p className="mt-2 text-white/80">{user.email ?? "No email"}</p>
            </div>

            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-sm text-white/45">Email confirmed</p>
              <p className="mt-2 text-white/80">
                {user.email_confirmed_at ? "Yes" : "No"}
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-sm text-white/45">Profile record</p>
              <p className="mt-2 text-white/80">
                {profile ? "Exists" : "Not created yet"}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-white/45">Database status</p>
            <p className="mt-2 text-white/80">
              {profileError
                ? `Error: ${profileError.message}`
                : profile
                  ? "Profile row loaded successfully."
                  : "No profile row found yet. We will create it next."}
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-white/45">Future profile fields</p>
            <p className="mt-2 text-white/60">
              Username, display name, bio, looking for, favorite games, vibe tags.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}