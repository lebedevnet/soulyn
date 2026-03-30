"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function parseList(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return [];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseText(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function saveProfileAction(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const payload = {
    id: user.id,
    email: user.email ?? null,
    username: parseText(formData.get("username")),
    display_name: parseText(formData.get("display_name")),
    bio: parseText(formData.get("bio")),
    looking_for: parseText(formData.get("looking_for")),
    favorite_games: parseList(formData.get("favorite_games")),
    vibe_tags: parseList(formData.get("vibe_tags")),
  };

  const { error } = await supabase
    .from("profiles")
    .upsert(payload, { onConflict: "id" })
    .select()
    .single();

  if (error) {
    redirect(`/profile?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/profile");
  revalidatePath("/discover");

  redirect("/profile?saved=1");
}