import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import AppShell from "@/components/app-shell";
import Avatar from "@/components/avatar";
import {
  ArrowLeftIcon,
  CheckIcon,
  MoonIcon,
  SparkleIcon,
  UsersIcon,
} from "@/components/icons";
import { createClient } from "@/lib/supabase/server";
import { joinRoomAction, leaveRoomAction } from "@/app/rooms/actions";

type RoomPageProps = {
  params: Promise<{
    roomId: string;
  }>;
};

type ProfileLite = {
  id: string;
  display_name: string | null;
  username: string | null;
};

export default async function RoomPage({ params }: RoomPageProps) {
  const { roomId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .select("id, title, category, description, is_night_room, created_at")
    .eq("id", roomId)
    .maybeSingle();

  if (roomError) {
    redirect(`/rooms?error=${encodeURIComponent(roomError.message)}`);
  }

  if (!room) {
    notFound();
  }

  const { data: members } = await supabase
    .from("room_members")
    .select("user_id, joined_at")
    .eq("room_id", roomId);

  const memberIds = (members ?? []).map((item) => item.user_id);
  const isJoined = memberIds.includes(user.id);

  let memberProfiles: ProfileLite[] = [];

  if (memberIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, display_name, username")
      .in("id", memberIds);

    memberProfiles = (profiles ?? []) as ProfileLite[];
  }

  const profileById = new Map(memberProfiles.map((item) => [item.id, item]));

  const { data: myProfile } = await supabase
    .from("profiles")
    .select("display_name, username")
    .eq("id", user.id)
    .maybeSingle();

  const userLabel =
    myProfile?.display_name ?? myProfile?.username ?? user.email ?? undefined;

  return (
    <AppShell pathname="/rooms" userLabel={userLabel}>
      <div className="mb-4">
        <Link
          href="/rooms"
          className="inline-flex items-center gap-2 text-sm text-white/55 transition hover:text-white"
        >
          <ArrowLeftIcon size={16} />
          Все комнаты
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-4">
          <div className="soul-surface relative overflow-hidden p-6 sm:p-8">
            {room.is_night_room ? (
              <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-gradient-to-br from-violet-500/30 to-pink-500/10 blur-3xl" />
            ) : null}

            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-white/45">
                  {room.category}
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                  {room.title}
                </h1>
              </div>

              {room.is_night_room ? (
                <span className="soul-chip soul-chip--accent">
                  <MoonIcon size={12} />
                  night
                </span>
              ) : null}
            </div>

            <p className="mt-5 text-[15px] leading-7 text-white/70">
              {room.description}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {isJoined ? (
                <form action={leaveRoomAction}>
                  <input type="hidden" name="room_id" value={room.id} />
                  <input type="hidden" name="return_to" value={`/rooms/${room.id}`} />
                  <button type="submit" className="soul-btn soul-btn--secondary">
                    Покинуть комнату
                  </button>
                </form>
              ) : (
                <form action={joinRoomAction}>
                  <input type="hidden" name="room_id" value={room.id} />
                  <input type="hidden" name="return_to" value={`/rooms/${room.id}`} />
                  <button type="submit" className="soul-btn soul-btn--primary">
                    <CheckIcon size={14} />
                    Присоединиться
                  </button>
                </form>
              )}

              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/65">
                <UsersIcon size={14} />
                {memberIds.length}{" "}
                {memberIds.length === 1 ? "участник" : "участников"}
              </span>
            </div>
          </div>

          <div className="soul-surface p-6">
            <div className="flex items-center gap-2 text-white">
              <SparkleIcon size={14} />
              <p className="font-medium">Живой чат комнаты скоро</p>
            </div>
            <p className="mt-3 text-sm leading-6 text-white/55">
              Мы собираем все комнаты в одну ленту без лишней активности: без
              реакций, без «печатает сейчас», только сообщения в своём ритме.
              Ждём, пока появится критическая масса участников — тогда включим
              живое общение.
            </p>
            <ul className="mt-4 space-y-1.5 text-sm text-white/55">
              <li>· приватность: никаких DM внутри комнат, только профиль</li>
              <li>· мягкая модерация, без капса и спама</li>
              <li>· ночной режим уменьшает яркость после 23:00</li>
            </ul>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="soul-surface p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                Участники
              </p>
              <span className="text-xs text-white/40">{memberIds.length}</span>
            </div>

            {memberIds.length > 0 ? (
              <ul className="mt-4 space-y-3">
                {memberIds.slice(0, 12).map((memberId) => {
                  const profile = profileById.get(memberId);
                  const label =
                    profile?.display_name ??
                    profile?.username ??
                    (memberId === user.id ? "Ты" : `Анон · ${memberId.slice(0, 6)}`);

                  return (
                    <li
                      key={memberId}
                      className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.02] px-3 py-2"
                    >
                      <Avatar name={label} seed={memberId} size={36} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{label}</p>
                        {profile?.username ? (
                          <p className="truncate text-xs text-white/40">
                            @{profile.username}
                          </p>
                        ) : null}
                      </div>
                      {memberId === user.id ? (
                        <span className="soul-chip !text-[10px] !py-0.5">ты</span>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-white/50">
                Пока в комнате никого нет. Присоединись первым.
              </p>
            )}
          </div>

          <div className="soul-surface p-5 text-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-white/40">
              Создано
            </p>
            <p className="mt-2 text-white/75">
              {new Intl.DateTimeFormat("ru-RU", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              }).format(new Date(room.created_at ?? Date.now()))}
            </p>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
