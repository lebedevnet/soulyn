"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function sendMessageAction(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const targetProfileId = formData.get("target_profile_id");
  const body = formData.get("body");

  if (typeof targetProfileId !== "string" || !targetProfileId) {
    redirect("/matches");
  }

  if (typeof body !== "string" || !body.trim()) {
    redirect(`/matches/${targetProfileId}?error=Message cannot be empty`);
  }

  const trimmedBody = body.trim();

  const { error } = await supabase.from("messages").insert({
    user_id: user.id,
    target_profile_id: targetProfileId,
    sender: "me",
    body: trimmedBody,
  });

  if (error) {
    redirect(`/matches/${targetProfileId}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath(`/matches/${targetProfileId}`);
  redirect(`/matches/${targetProfileId}?sent=1`);
}