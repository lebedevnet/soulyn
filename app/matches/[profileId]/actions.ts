"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const autoRepliesByProfile: Record<string, string[]> = {
  "1": [
    "That already sounds comfortable.",
    "Late-night people usually understand each other better.",
    "I like the calm vibe of this chat already.",
  ],
  "3": [
    "That is actually a very good answer.",
    "I had a feeling we would get along.",
    "I am always curious when someone can do both memes and deep talks.",
  ],
};

function pickAutoReply(profileId: string) {
  const replies = autoRepliesByProfile[profileId] ?? [
    "Sounds good.",
    "I would like to hear more.",
    "That is a nice start.",
  ];

  const randomIndex = Math.floor(Math.random() * replies.length);
  return replies[randomIndex];
}

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
  const autoReply = pickAutoReply(targetProfileId);

  const baseTime = Date.now();
  const myMessageCreatedAt = new Date(baseTime).toISOString();
  const replyCreatedAt = new Date(baseTime + 1).toISOString();

  const { error } = await supabase.from("messages").insert([
    {
      user_id: user.id,
      target_profile_id: targetProfileId,
      sender: "me",
      body: trimmedBody,
      created_at: myMessageCreatedAt,
    },
    {
      user_id: user.id,
      target_profile_id: targetProfileId,
      sender: "them",
      body: autoReply,
      created_at: replyCreatedAt,
    },
  ]);

  if (error) {
    redirect(`/matches/${targetProfileId}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath(`/matches/${targetProfileId}`);
  revalidatePath("/matches");
  redirect(`/matches/${targetProfileId}?sent=1`);
}