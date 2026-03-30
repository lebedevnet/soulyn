"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function saveSwipeAction(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const targetProfileId = formData.get("target_profile_id");
  const direction = formData.get("direction");

  if (
    typeof targetProfileId !== "string" ||
    !targetProfileId ||
    (direction !== "like" && direction !== "pass")
  ) {
    redirect("/discover?error=Invalid swipe payload");
  }

  const { error } = await supabase.from("swipes").insert({
    user_id: user.id,
    target_profile_id: targetProfileId,
    direction,
  });

  if (error) {
    redirect(`/discover?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/discover");
}