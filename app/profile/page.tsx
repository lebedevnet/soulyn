import Link from "next/link";

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white sm:px-8 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/40">
              Soulyn
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              Profile
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/60">
              Здесь будет профиль пользователя: описание, интересы, игры, формат
              общения и настройки приватности.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-full border border-white/15 px-5 py-3 text-sm text-white/80 transition hover:border-white/30 hover:text-white"
          >
            Back to home
          </Link>
        </div>

        <div className="mt-10 rounded-[32px] border border-white/10 bg-white/[0.04] p-6">
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
      </div>
    </main>
  );
}