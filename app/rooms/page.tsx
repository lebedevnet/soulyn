import Link from "next/link";
import { redirect } from "next/navigation";
import AppShell, { PageHeader } from "@/components/app-shell";
import {
  CheckIcon,
  MoonIcon,
  SparkleIcon,
  UsersIcon,
} from "@/components/icons";
import { createClient } from "@/lib/supabase/server";
import { joinRoomAction, leaveRoomAction } from "@/app/rooms/actions";

type RoomsPageProps = {
  searchParams: Promise<{
    joined?: string;
    left?: string;
    error?: string;
  }>;
};

type Room = {
  id: string;
  title: string;
  category: string;
  description: string;
  is_night_room: boolean;
};

type RoomMember = {
  room_id: string;
  user_id: string;
};

export default async function RoomsPage({ searchParams }: RoomsPageProps) {
  const query = await searchParams;
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

  const [{ data: rooms, error: roomsError }, { data: memberships, error: membershipsError }] =
    await Promise.all([
      supabase
        .from("rooms")
        .select("id, title, category, description, is_night_room")
        .order("created_at", { ascending: true }),
      supabase.from("room_members").select("room_id, user_id"),
    ]);

  if (roomsError || membershipsError) {
    const message = roomsError?.message ?? membershipsError?.message ?? "";
    redirect(`/discover?error=${encodeURIComponent(message)}`);
  }

  const myRoomIds = new Set(
    (memberships ?? [])
      .filter((membership: RoomMember) => membership.user_id === user.id)
      .map((membership: RoomMember) => membership.room_id),
  );

  const memberCountByRoom = new Map<string, number>();
  for (const membership of memberships ?? []) {
    memberCountByRoom.set(
      membership.room_id,
      (memberCountByRoom.get(membership.room_id) ?? 0) + 1,
    );
  }

  const typedRooms = (rooms ?? []) as Room[];
  const myRooms = typedRooms.filter((room) => myRoomIds.has(room.id));
  const otherRooms = typedRooms.filter((room) => !myRoomIds.has(room.id));

  const nightRoomsCount = typedRooms.filter((room) => room.is_night_room).length;

  return (
    <AppShell pathname="/rooms" userLabel={userLabel}>
      <PageHeader
        eyebrow="Rooms"
        title="Тематические комнаты"
        description="Тихие пространства по играм, фандомам и ночным вайбам. Можно просто присоединиться — или сначала наблюдать."
        actions={
          <span className="soul-chip">
            <MoonIcon size={12} />
            {nightRoomsCount} night rooms
          </span>
        }
      />

      {query.joined ? (
        <Banner tone="success">Ты в комнате. Залетай в любое время.</Banner>
      ) : null}
      {query.left ? <Banner tone="neutral">Ты покинул(а) комнату.</Banner> : null}
      {query.error ? <Banner tone="error">{query.error}</Banner> : null}

      {typedRooms.length === 0 ? (
        <div className="soul-surface p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-400/20 to-pink-400/20 text-white">
            <UsersIcon size={20} />
          </div>
          <h3 className="mt-4 text-xl font-semibold">Комнат пока нет</h3>
          <p className="mt-2 text-sm text-white/55">
            Админы ещё не создали ни одной комнаты. Загляни позже.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {myRooms.length > 0 ? (
            <section>
              <SectionTitle eyebrow="Мои" title="Где ты уже состоишь" count={myRooms.length} />
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {myRooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    memberCount={memberCountByRoom.get(room.id) ?? 0}
                    isJoined
                  />
                ))}
              </div>
            </section>
          ) : null}

          <section>
            <SectionTitle
              eyebrow="Explore"
              title="К чему можно присоединиться"
              count={otherRooms.length}
            />

            {otherRooms.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {otherRooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    memberCount={memberCountByRoom.get(room.id) ?? 0}
                    isJoined={false}
                  />
                ))}
              </div>
            ) : (
              <div className="soul-surface p-6 text-sm text-white/55">
                Ты уже во всех доступных комнатах. Новые появятся скоро.
              </div>
            )}
          </section>
        </div>
      )}
    </AppShell>
  );
}

function Banner({
  tone,
  children,
}: {
  tone: "success" | "neutral" | "error";
  children: React.ReactNode;
}) {
  const style =
    tone === "success"
      ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-100"
      : tone === "error"
        ? "border-red-500/30 bg-red-500/10 text-red-200"
        : "border-white/10 bg-white/[0.04] text-white/75";

  return (
    <div className={`mb-4 rounded-2xl border px-4 py-3 text-sm ${style}`}>
      {children}
    </div>
  );
}

function SectionTitle({
  eyebrow,
  title,
  count,
}: {
  eyebrow: string;
  title: string;
  count: number;
}) {
  return (
    <div className="mb-4 flex items-end justify-between">
      <div>
        <p className="text-[11px] uppercase tracking-[0.28em] text-white/40">
          {eyebrow}
        </p>
        <h2 className="mt-1 text-lg font-semibold">{title}</h2>
      </div>
      <span className="text-xs text-white/40">{count}</span>
    </div>
  );
}

function RoomCard({
  room,
  memberCount,
  isJoined,
}: {
  room: Room;
  memberCount: number;
  isJoined: boolean;
}) {
  return (
    <article
      className={`soul-surface relative overflow-hidden p-5 transition ${
        isJoined ? "ring-1 ring-violet-400/20" : "soul-surface-hover"
      }`}
    >
      {room.is_night_room ? (
        <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-gradient-to-br from-violet-400/40 to-pink-400/20 blur-2xl" />
      ) : null}

      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-white/40">
            {room.category}
          </p>
          <h3 className="mt-1 text-xl font-semibold">{room.title}</h3>
        </div>

        {room.is_night_room ? (
          <span className="soul-chip soul-chip--accent !text-[10px]">
            <MoonIcon size={10} />
            night
          </span>
        ) : null}
      </div>

      <p className="mt-3 text-sm leading-6 text-white/60">
        {room.description}
      </p>

      <div className="mt-5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-white/50">
          <UsersIcon size={14} />
          {memberCount} {memberCount === 1 ? "участник" : "участников"}
        </div>

        {isJoined ? (
          <Link
            href={`/rooms/${room.id}`}
            className="soul-btn soul-btn--primary !py-2 !px-4 text-[13px]"
          >
            <SparkleIcon size={12} />
            Открыть
          </Link>
        ) : null}
      </div>

      <div className="mt-4 flex items-center gap-2">
        {isJoined ? (
          <form action={leaveRoomAction}>
            <input type="hidden" name="room_id" value={room.id} />
            <button type="submit" className="soul-btn soul-btn--ghost !py-2 !px-3 text-[13px]">
              Выйти
            </button>
          </form>
        ) : (
          <form action={joinRoomAction} className="flex-1">
            <input type="hidden" name="room_id" value={room.id} />
            <button type="submit" className="soul-btn soul-btn--secondary w-full !py-2 text-[13px]">
              <CheckIcon size={14} />
              Присоединиться
            </button>
          </form>
        )}
      </div>
    </article>
  );
}
