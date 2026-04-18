"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const autoRepliesByProfile: Record<string, string[]> = {
  "1": [
    "Это звучит уютно.",
    "Люди, которые живут по ночам, обычно быстрее понимают друг друга.",
    "Мне уже нравится тон этого чата.",
    "Я как раз о таком и подумала пару минут назад.",
  ],
  "3": [
    "Классный ответ, если честно.",
    "У меня было чувство, что мы подружимся.",
    "Мне нравится, когда человек может и мемы, и серьёзно.",
    "Я сейчас улыбаюсь, и это немного странно.",
  ],
  "5": [
    "Ты прав(а), тишина — тоже форма близости.",
    "Люблю такие сообщения без лишнего пафоса.",
    "Записала тебе виртуальный плюс.",
  ],
};

const defaultReplies = [
  "Звучит хорошо.",
  "Мне интересно услышать больше.",
  "Это неплохой старт.",
  "Ок, это окей :)",
];

function pickAutoReply(profileId: string) {
  const replies = autoRepliesByProfile[profileId] ?? defaultReplies;
  return replies[Math.floor(Math.random() * replies.length)];
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
    redirect(`/matches/${targetProfileId}?error=Сообщение не может быть пустым`);
  }

  const trimmedBody = body.trim().slice(0, 500);
  const autoReply = pickAutoReply(targetProfileId);

  const now = Date.now();
  const myMessageCreatedAt = new Date(now).toISOString();
  const replyCreatedAt = new Date(now + 1200).toISOString();

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
    redirect(
      `/matches/${targetProfileId}?error=${encodeURIComponent(error.message)}`,
    );
  }

  await supabase
    .from("matches")
    .update({ last_read_at: new Date().toISOString() })
    .eq("user_id", user.id)
    .eq("target_profile_id", targetProfileId);

  revalidatePath(`/matches/${targetProfileId}`);
  revalidatePath("/matches");
}
