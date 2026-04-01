"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { demoCandidates } from "@/lib/discover/demo-candidates";

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

  const { error: swipeError } = await supabase.from("swipes").insert({
    user_id: user.id,
    target_profile_id: targetProfileId,
    direction,
  });

  if (swipeError) {
    redirect(`/discover?error=${encodeURIComponent(swipeError.message)}`);
  }

  if (direction === "like") {
    const candidate = demoCandidates.find((item) => item.id === targetProfileId);

    if (candidate?.likedYou) {
      const { error: matchError } = await supabase.from("matches").upsert(
        {
          user_id: user.id,
          target_profile_id: targetProfileId,
        },
        {
          onConflict: "user_id,target_profile_id",
        },
      );

      if (matchError) {
        redirect(`/discover?error=${encodeURIComponent(matchError.message)}`);
      }
    }
  }

  revalidatePath("/discover");
  revalidatePath("/matches");
}