import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import AppShell from "@/components/app-shell";
import { createClient } from "@/lib/supabase/server";
import { demoCandidates } from "@/lib/discover/demo-candidates";
import { sendMessageAction } from "@/app/matches/[profileId]/actions";

type MatchChatPageProps = {
  params: Promise<{
    profileId: string;
  }>;
  searchParams: Promise<{
    sent?: string;
    error?: string;
  }>;
};

export default async function MatchChatPage({
  params,
  searchParams,
}: MatchChatPageProps) {
  const { profileId } = await params;
  const query = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: match, error: matchError } = await supabase
    .from("matches")
    .select("target_profile_id, created_at")
    .eq("user_id", user.id)
    .eq("target_profile_id", profileId)
    .maybeSingle();

  if (matchError) {
    redirect("/matches");
  }

  if (!match) {
    notFound();
  }

  const profile = demoCandidates.find((item) => item.id === profileId);

  if (!profile) {
    notFound();
  }

  const { data: messages, error: messagesError } = await supabase
    .from("messages")
    .select("id, sender, body, created_at")
    .eq("user_id", user.id)
    .eq("target_profile_id", profileId)
    .order("created_at", { ascending: true });

  if (messagesError) {
    redirect(`/matches/${profileId}?error=${encodeURIComponent(messagesError.message)}`);
  }

  return (
    <AppShell
      title={`${profile.name} chat`}
      description="Первый экран переписки для mutual match."
      pathname="/matches"
    >
      <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-4">
          <div className="rounded-[28px] border border-emerald-500/20 bg-emerald-500/5 p-6">
            <p className="text-sm text-emerald-200/80">Mutual match</p>
            <h2 className="mt-2 text-3xl font-semibold">
              {profile.name}, {profile.age}
            </h2>
            <p className="mt-2 text-white/55">{profile.city}</p>

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
                  {new Date(match.created_at).toLocaleString()}
                </p>
              </div>
            </div>

            <Link
              href="/matches"
              className="mt-6 inline-flex rounded-full border border-white/15 px-5 py-3 text-sm text-white/80 transition hover:border-white/30 hover:text-white"
            >
              Back to matches
            </Link>
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6">
          <div className="border-b border-white/10 pb-4">
            <p className="text-sm text-white/45">Conversation</p>
            <h2 className="mt-2 text-2xl font-semibold">
              Chat with {profile.name}
            </h2>
          </div>

          <div className="mt-6 space-y-4">
            {query.sent ? (
              <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-4">
                <p className="text-sm text-emerald-200">Message sent.</p>
              </div>
            ) : null}

            {query.error ? (
              <div className="rounded-2xl border border-red-500/25 bg-red-500/10 p-4">
                <p className="text-sm text-red-200">{query.error}</p>
              </div>
            ) : null}

            {messages && messages.length > 0 ? (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`max-w-[85%] rounded-3xl px-4 py-3 ${
                    message.sender === "me"
                      ? "ml-auto bg-white text-black"
                      : "bg-white/8 text-white"
                  }`}
                >
                  <p className="text-sm leading-6">{message.body}</p>
                  <p
                    className={`mt-2 text-xs ${
                      message.sender === "me"
                        ? "text-black/60"
                        : "text-white/45"
                    }`}
                  >
                    {new Date(message.created_at).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-2xl bg-white/5 p-4 text-white/65">
                No messages yet.
              </div>
            )}
          </div>

          <form action={sendMessageAction} className="mt-6 border-t border-white/10 pt-4">
            <input type="hidden" name="target_profile_id" value={profileId} />

            <label htmlFor="body" className="mb-2 block text-sm text-white/45">
              Message
            </label>

            <textarea
              id="body"
              name="body"
              rows={4}
              placeholder="Type your message here..."
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-white/25"
            />

            <button
              type="submit"
              className="mt-4 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:opacity-90"
            >
              Send message
            </button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}