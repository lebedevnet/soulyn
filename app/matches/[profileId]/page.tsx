import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import AppShell from "@/components/app-shell";
import Avatar from "@/components/avatar";
import ChatComposer from "@/components/chat-composer";
import ChatScroller from "@/components/chat-scroller";
import { ArrowLeftIcon, HeartSolidIcon } from "@/components/icons";
import { createClient } from "@/lib/supabase/server";
import { demoCandidates } from "@/lib/discover/demo-candidates";

type MatchChatPageProps = {
  params: Promise<{
    profileId: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

type MessageItem = {
  id: string;
  sender: "me" | "them";
  body: string;
  created_at: string;
};

function formatDayLabel(value: string) {
  const date = new Date(value);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Сегодня";
  if (date.toDateString() === yesterday.toDateString()) return "Вчера";

  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatTimeLabel(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

type MessageGroup = {
  day: string;
  items: { author: "me" | "them"; messages: MessageItem[] }[];
};

function groupMessages(messages: MessageItem[]): MessageGroup[] {
  const groups: MessageGroup[] = [];

  for (const message of messages) {
    const day = new Date(message.created_at).toDateString();
    let dayGroup = groups[groups.length - 1];

    if (!dayGroup || dayGroup.day !== day) {
      dayGroup = { day, items: [] };
      groups.push(dayGroup);
    }

    const lastCluster = dayGroup.items[dayGroup.items.length - 1];
    if (lastCluster && lastCluster.author === message.sender) {
      lastCluster.messages.push(message);
    } else {
      dayGroup.items.push({ author: message.sender, messages: [message] });
    }
  }

  return groups;
}

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
    redirect(
      `/matches/${profileId}?error=${encodeURIComponent(messagesError.message)}`,
    );
  }

  const { data: myProfile } = await supabase
    .from("profiles")
    .select("display_name, username")
    .eq("id", user.id)
    .maybeSingle();

  const userLabel =
    myProfile?.display_name ?? myProfile?.username ?? user.email ?? undefined;

  const messageList = (messages ?? []) as MessageItem[];
  const groups = groupMessages(messageList);

  return (
    <AppShell pathname="/matches" userLabel={userLabel}>
      <div className="mb-4">
        <Link
          href="/matches"
          className="inline-flex items-center gap-2 text-sm text-white/55 transition hover:text-white"
        >
          <ArrowLeftIcon size={16} />
          Все матчи
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.75fr_1.25fr]">
        <aside className="space-y-4">
          <div className="soul-surface p-6 text-center">
            <Avatar name={profile.name} size={96} showStatus={profile.online === "online"} />
            <div className="mt-4 flex items-center justify-center gap-2">
              <h2 className="text-xl font-semibold">
                {profile.name}, {profile.age}
              </h2>
              <HeartSolidIcon size={14} className="text-pink-400" />
            </div>
            <p className="mt-1 text-sm text-white/55">
              {profile.city}
              {profile.pronouns ? ` · ${profile.pronouns}` : ""}
            </p>

            <p className="mt-4 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] uppercase tracking-widest text-emerald-200">
              mutual match
            </p>
          </div>

          <div className="soul-surface p-5 text-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-white/40">
              Looking for
            </p>
            <p className="mt-2 text-white/85">{profile.lookingFor}</p>
          </div>

          <div className="soul-surface p-5 text-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-white/40">
              Games
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {profile.games.map((game) => (
                <span key={game} className="soul-chip">
                  {game}
                </span>
              ))}
            </div>
          </div>

          <div className="soul-surface p-5 text-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-white/40">
              Vibe
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {profile.vibeTags.map((tag) => (
                <span key={tag} className="soul-chip soul-chip--accent">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-white/35">
            Мэтч установлен{" "}
            {new Intl.DateTimeFormat("ru-RU", {
              day: "2-digit",
              month: "long",
              hour: "2-digit",
              minute: "2-digit",
            }).format(new Date(match.created_at))}
          </p>
        </aside>

        <div className="soul-surface flex h-[calc(100svh-220px)] min-h-[440px] flex-col overflow-hidden md:h-[72svh]">
          <div className="flex items-center gap-3 border-b border-white/5 bg-black/40 px-4 py-3 backdrop-blur sm:px-6">
            <Avatar name={profile.name} size={40} showStatus={profile.online === "online"} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-semibold">
                {profile.name}
              </p>
              <p className="text-xs text-white/45">
                {profile.online === "online"
                  ? "в сети"
                  : profile.online === "night"
                    ? "обычно ночью"
                    : "был(а) недавно"}
              </p>
            </div>
          </div>

          <ChatScroller trigger={messageList.length}>
            {query.error ? (
              <div className="mb-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {query.error}
              </div>
            ) : null}

            {groups.length > 0 ? (
              <div className="space-y-6">
                {groups.map((group) => (
                  <div key={group.day} className="space-y-3">
                    <div className="flex justify-center">
                      <span className="rounded-full border border-white/5 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-widest text-white/50">
                        {formatDayLabel(group.items[0].messages[0].created_at)}
                      </span>
                    </div>

                    {group.items.map((cluster, index) => (
                      <div
                        key={`${cluster.author}-${index}`}
                        className={`flex gap-2 ${
                          cluster.author === "me" ? "justify-end" : "justify-start"
                        }`}
                      >
                        {cluster.author === "them" ? (
                          <Avatar name={profile.name} size={32} className="self-end" />
                        ) : null}

                        <div
                          className={`flex max-w-[78%] flex-col gap-1 ${
                            cluster.author === "me" ? "items-end" : "items-start"
                          }`}
                        >
                          {cluster.messages.map((message, messageIndex) => {
                            const isLast =
                              messageIndex === cluster.messages.length - 1;
                            return (
                              <div
                                key={message.id}
                                className={`px-4 py-2.5 text-[15px] leading-6 ${
                                  cluster.author === "me"
                                    ? "soul-bubble-me"
                                    : "soul-bubble-them"
                                }`}
                                style={{
                                  borderRadius:
                                    cluster.author === "me"
                                      ? `20px 20px ${isLast ? "6px" : "20px"} 20px`
                                      : `20px 20px 20px ${isLast ? "6px" : "20px"}`,
                                }}
                              >
                                {message.body}
                              </div>
                            );
                          })}
                          <span className="text-[10px] uppercase tracking-widest text-white/30">
                            {formatTimeLabel(
                              cluster.messages[cluster.messages.length - 1]
                                .created_at,
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-400/20 to-pink-400/20 text-white/80">
                  <HeartSolidIcon size={20} />
                </div>
                <p className="mt-4 text-base font-semibold">
                  Ты и {profile.name} — mutual match
                </p>
                <p className="mt-2 max-w-xs text-sm leading-6 text-white/55">
                  Напиши что-нибудь искреннее. Никаких шаблонных «привет как
                  дела» — задай тон, который тебе подходит.
                </p>
              </div>
            )}
          </ChatScroller>

          <ChatComposer profileId={profile.id} profileName={profile.name} />
        </div>
      </div>
    </AppShell>
  );
}
