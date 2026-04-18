import Link from "next/link";
import { redirect } from "next/navigation";
import AppShell, { PageHeader } from "@/components/app-shell";
import Avatar from "@/components/avatar";
import { HeartIcon, MessageIcon, SparkleIcon } from "@/components/icons";
import { createClient } from "@/lib/supabase/server";
import {
  demoCandidates,
  type DiscoverCandidate,
} from "@/lib/discover/demo-candidates";

type MatchRecord = DiscoverCandidate & {
  createdAt: string;
  lastReadAt: string | null;
  lastMessage?: {
    body: string;
    sender: "me" | "them";
    createdAt: string;
  };
};

type PendingRecord = DiscoverCandidate & {
  createdAt: string;
};

function relativeTime(value: string) {
  const now = Date.now();
  const then = new Date(value).getTime();
  const diff = Math.max(0, now - then);
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return "только что";
  if (diff < hour) return `${Math.floor(diff / minute)} мин назад`;
  if (diff < day) return `${Math.floor(diff / hour)} ч назад`;
  if (diff < 7 * day) return `${Math.floor(diff / day)} д назад`;
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
  }).format(new Date(value));
}

export default async function MatchesPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, username")
    .eq("id", user.id)
    .maybeSingle();

  const userLabel =
    profile?.display_name ?? profile?.username ?? user.email ?? undefined;

  const [{ data: matches, error: matchesError }, { data: swipes, error: swipesError }, { data: messages, error: messagesError }] =
    await Promise.all([
      supabase
        .from("matches")
        .select("target_profile_id, created_at, last_read_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("swipes")
        .select("target_profile_id, direction, created_at")
        .eq("user_id", user.id)
        .eq("direction", "like")
        .order("created_at", { ascending: false }),
      supabase
        .from("messages")
        .select("target_profile_id, sender, body, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
    ]);

  if (matchesError || swipesError || messagesError) {
    const message =
      matchesError?.message ?? swipesError?.message ?? messagesError?.message;
    redirect(`/discover?error=${encodeURIComponent(message ?? "")}`);
  }

  const lastMessageByProfile = new Map<
    string,
    { body: string; sender: "me" | "them"; createdAt: string }
  >();

  for (const message of messages ?? []) {
    if (!lastMessageByProfile.has(message.target_profile_id)) {
      lastMessageByProfile.set(message.target_profile_id, {
        body: message.body,
        sender: message.sender,
        createdAt: message.created_at,
      });
    }
  }

  const matchMap = new Map<
    string,
    { createdAt: string; lastReadAt: string | null }
  >();

  for (const match of matches ?? []) {
    if (!matchMap.has(match.target_profile_id)) {
      matchMap.set(match.target_profile_id, {
        createdAt: match.created_at,
        lastReadAt: match.last_read_at,
      });
    }
  }

  const realMatches: MatchRecord[] = Array.from(matchMap.entries()).reduce<
    MatchRecord[]
  >((acc, [profileId, meta]) => {
    const candidate = demoCandidates.find((item) => item.id === profileId);
    if (!candidate) return acc;

    acc.push({
      ...candidate,
      createdAt: meta.createdAt,
      lastReadAt: meta.lastReadAt,
      lastMessage: lastMessageByProfile.get(profileId),
    });

    return acc;
  }, []);

  const realMatchIds = new Set(realMatches.map((item) => item.id));

  const latestLikedSwipeByProfile = new Map<string, string>();
  for (const swipe of swipes ?? []) {
    if (!latestLikedSwipeByProfile.has(swipe.target_profile_id)) {
      latestLikedSwipeByProfile.set(swipe.target_profile_id, swipe.created_at);
    }
  }

  const pendingLikes: PendingRecord[] = Array.from(
    latestLikedSwipeByProfile.entries(),
  ).reduce<PendingRecord[]>((acc, [profileId, createdAt]) => {
    if (realMatchIds.has(profileId)) return acc;
    const candidate = demoCandidates.find((item) => item.id === profileId);
    if (!candidate) return acc;

    acc.push({ ...candidate, createdAt });
    return acc;
  }, []);

  let unreadCount = 0;

  for (const match of realMatches) {
    if (
      match.lastMessage?.sender === "them" &&
      (!match.lastReadAt ||
        new Date(match.lastMessage.createdAt).getTime() >
          new Date(match.lastReadAt).getTime())
    ) {
      unreadCount += 1;
    }
  }

  return (
    <AppShell
      pathname="/matches"
      unreadMatches={unreadCount}
      userLabel={userLabel}
    >
      <PageHeader
        eyebrow="Matches"
        title="Твои взаимные"
        description="Чаты с теми, с кем симпатия оказалась взаимной. Остальные симпатии ждут своего часа."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Чаты</h2>
            <span className="text-xs text-white/40">
              {realMatches.length > 0
                ? `${realMatches.length} mutual`
                : "пока пусто"}
            </span>
          </div>

          {realMatches.length > 0 ? (
            <ul className="soul-surface divide-y divide-white/5 overflow-hidden">
              {realMatches.map((match) => (
                <MatchRow key={match.id} match={match} />
              ))}
            </ul>
          ) : (
            <EmptyState
              title="Mutual matches появятся здесь"
              text="Как только твоя симпатия станет взаимной — откроется приватный чат. А пока продолжай Discover."
              actionHref="/discover"
              actionText="В Discover"
            />
          )}
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Ожидают ответа</h2>
            <span className="text-xs text-white/40">
              {pendingLikes.length > 0 ? `${pendingLikes.length} likes` : ""}
            </span>
          </div>

          {pendingLikes.length > 0 ? (
            <ul className="soul-surface divide-y divide-white/5 overflow-hidden">
              {pendingLikes.map((pending) => (
                <li
                  key={pending.id}
                  className="flex items-center gap-3 px-4 py-3"
                >
                  <Avatar name={pending.name} size={44} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-medium">
                      {pending.name}, {pending.age}
                    </p>
                    <p className="truncate text-xs text-white/45">
                      {pending.city} · {relativeTime(pending.createdAt)}
                    </p>
                  </div>
                  <span className="soul-chip !text-[10px] !py-0.5">
                    waiting
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="soul-surface p-5 text-sm text-white/55">
              Пока ты никого не лайкнул(а). Открой Discover и попробуй.
            </div>
          )}

          <div className="soul-surface p-5 text-sm text-white/60">
            <div className="flex items-center gap-2 text-white">
              <SparkleIcon size={14} />
              <p className="font-medium">Как работает мэтч</p>
            </div>
            <ol className="mt-3 list-decimal space-y-1 pl-5 text-white/55">
              <li>Ты лайкаешь человека в Discover.</li>
              <li>Если он тоже лайкнул — открывается приватный чат.</li>
              <li>Общайтесь в своём ритме, без давления.</li>
            </ol>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function MatchRow({ match }: { match: MatchRecord }) {
  const hasUnread =
    match.lastMessage?.sender === "them" &&
    (!match.lastReadAt ||
      new Date(match.lastMessage.createdAt).getTime() >
        new Date(match.lastReadAt).getTime());

  const lastMessagePreview = match.lastMessage
    ? `${match.lastMessage.sender === "me" ? "Ты: " : ""}${match.lastMessage.body}`
    : "Скажи «привет» первым.";

  return (
    <li className="transition hover:bg-white/[0.03]">
      <Link
        href={`/matches/${match.id}/open`}
        className="flex items-center gap-3 px-4 py-3"
      >
        <Avatar name={match.name} size={52} showStatus={match.online === "online"} />

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="truncate text-[15px] font-medium">
              {match.name}, {match.age}
            </p>
            <span className="shrink-0 text-[11px] text-white/40">
              {match.lastMessage
                ? relativeTime(match.lastMessage.createdAt)
                : relativeTime(match.createdAt)}
            </span>
          </div>
          <p
            className={`mt-1 truncate text-sm ${
              hasUnread ? "font-medium text-white" : "text-white/55"
            }`}
          >
            {lastMessagePreview}
          </p>
        </div>

        {hasUnread ? (
          <span className="inline-flex h-2 w-2 shrink-0 rounded-full bg-gradient-to-br from-violet-400 to-pink-400" />
        ) : null}
      </Link>
    </li>
  );
}

function EmptyState({
  title,
  text,
  actionHref,
  actionText,
}: {
  title: string;
  text: string;
  actionHref: string;
  actionText: string;
}) {
  return (
    <div className="soul-surface flex flex-col items-start gap-3 p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400/20 to-pink-400/20 text-white/80">
        <HeartIcon size={18} />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm leading-6 text-white/55">{text}</p>
      <Link href={actionHref} className="soul-btn soul-btn--secondary mt-1">
        <MessageIcon size={14} />
        {actionText}
      </Link>
    </div>
  );
}
