"use client";

import { useState, useTransition, type FormEvent } from "react";
import { sendMessageAction } from "@/app/matches/[profileId]/actions";
import { SendIcon } from "@/components/icons";

type ChatComposerProps = {
  profileId: string;
  profileName: string;
};

export default function ChatComposer({ profileId, profileName }: ChatComposerProps) {
  const [value, setValue] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || isPending) return;

    const formData = new FormData();
    formData.append("target_profile_id", profileId);
    formData.append("body", trimmed);

    startTransition(async () => {
      await sendMessageAction(formData);
    });

    setValue("");
  }

  const count = value.length;
  const max = 500;

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-white/5 bg-black/40 px-4 py-3 sm:px-6 sm:py-4"
    >
      <div className="flex items-end gap-3">
        <div className="flex-1 rounded-2xl border border-white/10 bg-white/[0.04] focus-within:border-violet-400/50">
          <textarea
            name="body"
            placeholder={`Напиши ${profileName}...`}
            rows={1}
            value={value}
            onChange={(event) => setValue(event.target.value.slice(0, max))}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
            className="max-h-40 w-full resize-none bg-transparent px-4 py-3 text-[15px] leading-6 text-white placeholder:text-white/35 focus:outline-none"
            style={{ minHeight: 48 }}
          />
        </div>

        <button
          type="submit"
          disabled={!value.trim() || isPending}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-pink-400 text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Send"
        >
          <SendIcon size={18} />
        </button>
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px] text-white/35">
        <span className="hidden sm:inline">
          <span className="soul-kbd">Enter</span> — отправить,{" "}
          <span className="soul-kbd">Shift</span>+<span className="soul-kbd">Enter</span> — новая строка
        </span>
        <span className={count > max - 50 ? "text-amber-300" : ""}>
          {count}/{max}
        </span>
      </div>
    </form>
  );
}
