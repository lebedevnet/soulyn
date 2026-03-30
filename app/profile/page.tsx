import AppShell from "@/components/app-shell";

export default function ProfilePage() {
  return (
    <AppShell
      title="Profile"
      description="Здесь будет профиль пользователя: описание, интересы, игры, формат общения и настройки приватности."
    >
      <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6">
        <p className="text-sm text-white/45">Profile preview</p>
        <h2 className="mt-2 text-2xl font-semibold">Soulyn user card</h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-white/5 p-4">
            <p className="text-sm text-white/45">About</p>
            <p className="mt-2 text-white/60">
              Короткое описание человека, его целей и стиля общения.
            </p>
          </div>

          <div className="rounded-2xl bg-white/5 p-4">
            <p className="text-sm text-white/45">Games</p>
            <p className="mt-2 text-white/60">
              Любимые игры, платформы, кооперативность и активность.
            </p>
          </div>

          <div className="rounded-2xl bg-white/5 p-4">
            <p className="text-sm text-white/45">Vibe tags</p>
            <p className="mt-2 text-white/60">
              Теги характера, уровня социализации и формата контакта.
            </p>
          </div>

          <div className="rounded-2xl bg-white/5 p-4">
            <p className="text-sm text-white/45">Privacy</p>
            <p className="mt-2 text-white/60">
              Настройки видимости, интро-чата и безопасного раскрытия профиля.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}