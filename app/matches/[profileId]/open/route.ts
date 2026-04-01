import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{
    profileId: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { profileId } = await context.params;
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.redirect(new URL("/login", _request.url));
  }

  await supabase
    .from("matches")
    .update({
      last_read_at: new Date().toISOString(),
    })
    .eq("user_id", user.id)
    .eq("target_profile_id", profileId);

  return NextResponse.redirect(new URL(`/matches/${profileId}`, _request.url));
}