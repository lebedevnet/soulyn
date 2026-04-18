import { redirect } from "next/navigation";
import AppShell, { PageHeader } from "@/components/app-shell";
import Avatar from "@/components/avatar";
import TagsInput from "@/components/tags-input";
import { CheckIcon } from "@/components/icons";
import { createClient } from "@/lib/supabase/server";
import { saveProfileAction } from "@/app/profile/actions";

type ProfilePageProps = {
  searchParams: Promise<{
    saved?: string;
    error?: string;
    setup?: string;
  }>;
};

const GAME_SUGGESTIONS = [
  "Valorant",
  "Minecraft",
  "Genshin Impact",
  "League of Legends",
  "Overwatch 2",
  "Stardew Valley",
  "The Sims 4",
  "Apex Legends",
  "Phasmophobia",
  "Honkai: Star Rail",
  "Lethal Company",
  "Dota 2",
  "CS2",
  "Hollow Knight",
];

const VIBE_SUGGESTIONS = [
  "introvert",
  "night owl",
  "comfort talk",
  "soft energy",
  "ironic",
  "memes",
  "deep talks",
  "cozy",
  "warm vibe",
  "voice first",
  "low energy",
  "fandom",
];

export default async function ProfilePage({
  searchParams,
}: ProfilePageProps) {
  const params = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  const displayName =
    profile?.display_name ?? profile?.username ?? user.email ?? "Soulyn";

  const hasProfile = Boolean(profile);

  return (
    <AppShell pathname="/profile" userLabel={user.email ?? undefined}>
      <PageHeader
        eyebrow="Profile"
        title={hasProfile ? "Твой профиль" : "Создай профиль"}
        description={
          hasProfile
            ? "Обновляй игры, вайб и формат общения — Discover подстроится под тебя."
            : "Заполни анкету, чтобы Soulyn смог подобрать тебе интересных людей."
        }
      />

      {params.setup ? (
        <div className="mb-4 rounded-2xl border border-amber-400/25 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
          Для доступа к Discover нужно сначала сохранить профиль.
        </div>
      ) : null}

      {params.saved ? (
        <div className="mb-4 flex items-center gap-2 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
          <CheckIcon size={16} />
          Изменения сохранены.
        </div>
      ) : null}

      {params.error ? (
        <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {params.error}
        </div>
      ) : null}

      {profileError ? (
        <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          Ошибка загрузки профиля: {profileError.message}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[0.7fr_1.3fr]">
        <aside className="space-y-4">
          <div className="soul-surface p-6 text-center">
            <div className="mx-auto">
              <Avatar name={displayName} size={96} />
            </div>
            <p className="mt-4 text-lg font-semibold">{displayName}</p>
            {profile?.username ? (
              <p className="text-sm text-white/50">@{profile.username}</p>
            ) : null}

            <p className="mt-4 text-xs text-white/45">
              Аватар генерируется автоматически из инициалов. Загрузка фото
              появится позже.
            </p>
          </div>

          <div className="soul-surface p-5 text-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-white/40">
              Аккаунт
            </p>
            <p className="mt-2 break-all text-white/80">
              {user.email ?? "—"}
            </p>
            <p className="mt-3 text-xs text-white/45">
              Вход по magic link. Выйти можно в верхней панели.
            </p>
          </div>

          <div className="soul-surface p-5 text-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-white/40">
              Статус
            </p>
            <p className="mt-2 text-white/80">
              {hasProfile ? "Профиль готов." : "Профиль ещё не создан."}
            </p>
          </div>
        </aside>

        <form
          action={saveProfileAction}
          autoComplete="off"
          className="soul-surface space-y-5 p-6 sm:p-8"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              id="username"
              name="username"
              label="Username"
              placeholder="nightowl"
              defaultValue={profile?.username ?? ""}
              hint="Латиница и цифры, без пробелов"
            />

            <Field
              id="display_name"
              name="display_name"
              label="Display name"
              placeholder="Night Owl"
              defaultValue={profile?.display_name ?? ""}
              hint="Как тебя будут видеть в ленте"
            />
          </div>

          <Field
            id="looking_for"
            name="looking_for"
            label="Looking for"
            placeholder="late-night chat, duo games, relationship"
            defaultValue={profile?.looking_for ?? ""}
            hint="Коротко — что ты ищешь сейчас"
          />

          <TagsInput
            name="favorite_games"
            label="Favorite games"
            placeholder="добавь игру и нажми Enter"
            initialValue={profile?.favorite_games ?? []}
            suggestions={GAME_SUGGESTIONS}
          />

          <TagsInput
            name="vibe_tags"
            label="Vibe"
            placeholder="добавь тег вайба"
            initialValue={profile?.vibe_tags ?? []}
            suggestions={VIBE_SUGGESTIONS}
            variant="accent"
          />

          <div>
            <label
              htmlFor="bio"
              className="mb-2 block text-xs uppercase tracking-[0.18em] text-white/45"
            >
              Bio
            </label>

            <textarea
              id="bio"
              name="bio"
              autoComplete="off"
              defaultValue={profile?.bio ?? ""}
              placeholder="Пара предложений о тебе, твоём вайбе и как тебе комфортно общаться."
              rows={5}
              maxLength={500}
              className="soul-input !rounded-2xl"
            />
            <p className="mt-1 text-[11px] text-white/35">
              До 500 символов. Постарайся показать настоящий тон общения.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button type="submit" className="soul-btn soul-btn--primary">
              <CheckIcon size={14} />
              {hasProfile ? "Сохранить изменения" : "Создать профиль"}
            </button>

            <p className="text-xs text-white/40">
              Эти данные видят только люди, которые тебя «мэтчат».
            </p>
          </div>
        </form>
      </div>
    </AppShell>
  );
}

type FieldProps = {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  defaultValue: string;
  hint?: string;
};

function Field({ id, name, label, placeholder, defaultValue, hint }: FieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-xs uppercase tracking-[0.18em] text-white/45"
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        autoComplete="off"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="soul-input"
      />
      {hint ? (
        <p className="mt-1 text-[11px] text-white/35">{hint}</p>
      ) : null}
    </div>
  );
}
