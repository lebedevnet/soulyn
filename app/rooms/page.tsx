import { redirect } from "next/navigation";
import AppShell from "@/components/app-shell";
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

  const { data: rooms, error: roomsError } = await supabase
    .from("rooms")
    .select("id, title, category, description, is_night_room")
    .order("created_at", { ascending: true });

  if (roomsError) {
    redirect(`/discover?error=${encodeURIComponent(roomsError.message)}`);
  }

  const { data: memberships, error: membershipsError } = await supabase
    .from("room_members")
    .select("room_id, user_id");

  if (membershipsError) {
    redirect(`/discover?error=${encodeURIComponent(membershipsError.message)}`);
  }

  const myRoomIds = new Set(
    (memberships ?? [])
      .filter((membership: RoomMember) => membership.user_id === user.id)
      .map((membership: RoomMember) => membership.room_id),
  );

  const memberCountByRoom = new Map<string, number>();

  for (const membership of memberships ?? []) {
    const currentCount = memberCountByRoom.get(membership.room_id) ?? 0;
    memberCountByRoom.set(membership.room_id, currentCount + 1);
  }

  return (
    <AppShell
      title="Rooms"
      description="Здесь будут тематические комнаты по играм, фандомам, знакомству, вайбу и позднему онлайн-общению."
      pathname="/rooms"
    >
      <div className="space-y-4">
        {query.joined ? (
          <div className="rounded-[28px] border border-emerald-500/25 bg-emerald-500/10 p-5">
            <p className="text-sm text-emerald-200">Room joined successfully.</p>
          </div>
        ) : null}

        {query.left ? (
          <div className="rounded-[28px] border border-white/15 bg-white/[0.04] p-5">
            <p className="text-sm text-white/80">You left the room.</p>
          </div>
        ) : null}

        {query.error ? (
          <div className="rounded-[28px] border border-red-500/25 bg-red-500/10 p-5">
            <p className="text-sm text-red-200">{query.error}</p>
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          {(rooms ?? []).map((room: Room) => {
            const isJoined = myRoomIds.has(room.id);
            const memberCount = memberCountByRoom.get(room.id) ?? 0;

            return (
              <div
                key={room.id}
                className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-white/45">{room.category}</p>
                    <h2 className="mt-2 text-2xl font-semibold">{room.title}</h2>
                  </div>

                  {room.is_night_room ? (
                    <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/65">
                      Night room
                    </div>
                  ) : null}
                </div>

                <div className="mt-5 space-y-3">
                  <div className="rounded-2xl bg-white/5 p-4">
                    <p className="text-sm text-white/45">Description</p>
                    <p className="mt-2 text-white/80">{room.description}</p>
                  </div>

                  <div className="rounded-2xl bg-white/5 p-4">
                    <p className="text-sm text-white/45">Members</p>
                    <p className="mt-2 text-white/80">{memberCount}</p>
                  </div>

                  <div className="rounded-2xl bg-white/5 p-4">
                    <p className="text-sm text-white/45">Your status</p>
                    <p className="mt-2 text-white/80">
                      {isJoined ? "Joined" : "Not joined"}
                    </p>
                  </div>
                </div>

                {isJoined ? (
                  <form action={leaveRoomAction} className="mt-6">
                    <input type="hidden" name="room_id" value={room.id} />
                    <button
                      type="submit"
                      className="rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white/80 transition hover:border-white/30 hover:text-white"
                    >
                      Leave room
                    </button>
                  </form>
                ) : (
                  <form action={joinRoomAction} className="mt-6">
                    <input type="hidden" name="room_id" value={room.id} />
                    <button
                      type="submit"
                      className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:opacity-90"
                    >
                      Join room
                    </button>
                  </form>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}