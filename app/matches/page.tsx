import AppShell from "@/components/app-shell";

export default function MatchesPage() {
  return (
    <AppShell
      title="Matches"
      description="Здесь будут взаимные мэтчи, анонимные интро-чаты и переход в обычный диалог после mutual unlock."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
          <p className="text-sm text-white/45">Anonymous intro</p>
          <h2 className="mt-2 text-2xl font-semibold">First safe contact</h2>
          <p className="mt-4 text-white/60">
            На этом этапе пользователи сначала начинают общение без полного
            раскрытия профиля.
          </p>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
          <p className="text-sm text-white/45">Unlocked chat</p>
          <h2 className="mt-2 text-2xl font-semibold">Full conversation</h2>
          <p className="mt-4 text-white/60">
            После взаимного интереса здесь будет обычный чат с историей сообщений.
          </p>
        </div>
      </div>
    </AppShell>
  );
}