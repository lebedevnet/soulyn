"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function resolveReturnPath(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return null;
  if (!value.startsWith("/")) return null;
  return value;
}

export async function joinRoomAction(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const roomId = formData.get("room_id");

  if (typeof roomId !== "string" || !roomId) {
    redirect("/rooms?error=Invalid room id");
  }

  const { error } = await supabase.from("room_members").upsert(
    {
      room_id: roomId,
      user_id: user.id,
    },
    { onConflict: "room_id,user_id" },
  );

  if (error) {
    redirect(`/rooms?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/rooms");
  revalidatePath(`/rooms/${roomId}`);

  const returnTo = resolveReturnPath(formData.get("return_to"));
  if (returnTo) {
    redirect(returnTo);
  }

  redirect("/rooms?joined=1");
}

export async function leaveRoomAction(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const roomId = formData.get("room_id");

  if (typeof roomId !== "string" || !roomId) {
    redirect("/rooms?error=Invalid room id");
  }

  const { error } = await supabase
    .from("room_members")
    .delete()
    .eq("room_id", roomId)
    .eq("user_id", user.id);

  if (error) {
    redirect(`/rooms?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/rooms");
  revalidatePath(`/rooms/${roomId}`);

  const returnTo = resolveReturnPath(formData.get("return_to"));
  if (returnTo) {
    redirect(returnTo);
  }

  redirect("/rooms?left=1");
}
