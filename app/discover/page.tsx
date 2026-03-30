import { redirect } from "next/navigation";
import AppShell from "@/components/app-shell";
import { createClient } from "@/lib/supabase/server";

export default async function DiscoverPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  const user = data?.claims;
  const email = typeof user?.email === "string" ? user.email : null;

  if (error || !user) {
    redirect("/login");
  }

  return (
    <AppShell
      title="Discover"
      description="Здесь будет основная лента профилей с подбором по интересам, играм, вайбу и формату общения."
      pathname="/discover"
    >
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6">
          <p className="text-sm text-white/45">Main feed area</p>
          <h2 className="mt-2 text-2xl font-semibold">Profile recommendations</h2>
          <p className="mt-4 text-white/60">
            Тут позже будет карточка профиля, совместимость, интересы, игры,
            кнопки like / pass и быстрые действия.
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-white/45">Current session</p>
            <p className="mt-2 text-white/90">
              {email ?? "Signed in user"}
            </p>
            <p className="mt-3 text-sm leading-6 text-white/60">
              Если ты видишь здесь свой email, значит серверная авторизация уже
              работает.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-white/45">Filters</p>
            <p className="mt-2 text-white/60">
              Игры, цель знакомства, время онлайна, вайб, язык.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-white/45">Matching logic</p>
            <p className="mt-2 text-white/60">
              Совпадение по интересам, активности и стилю общения.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}