"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { CloseIcon, PlusIcon } from "@/components/icons";

type TagsInputProps = {
  name: string;
  label: string;
  placeholder?: string;
  initialValue?: string[];
  suggestions?: string[];
  max?: number;
  variant?: "accent" | "neutral";
};

function normalize(value: string) {
  return value.replace(/^#+/, "").trim();
}

export default function TagsInput({
  name,
  label,
  placeholder,
  initialValue = [],
  suggestions = [],
  max = 12,
  variant = "neutral",
}: TagsInputProps) {
  const [tags, setTags] = useState<string[]>(initialValue);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function commit(raw: string) {
    const parts = raw
      .split(",")
      .map(normalize)
      .filter(Boolean);

    if (parts.length === 0) {
      return;
    }

    setTags((previous) => {
      const next = [...previous];

      for (const part of parts) {
        const exists = next.some(
          (item) => item.toLowerCase() === part.toLowerCase(),
        );

        if (!exists && next.length < max) {
          next.push(part);
        }
      }

      return next;
    });

    setDraft("");
  }

  function remove(index: number) {
    setTags((previous) => previous.filter((_, currentIndex) => currentIndex !== index));
    inputRef.current?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commit(draft);
      return;
    }

    if (event.key === "Backspace" && !draft && tags.length > 0) {
      setTags((previous) => previous.slice(0, -1));
    }
  }

  const available = suggestions.filter(
    (suggestion) =>
      !tags.some(
        (tag) => tag.toLowerCase() === suggestion.toLowerCase(),
      ),
  );

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <label
          htmlFor={`${name}-input`}
          className="text-xs uppercase tracking-[0.18em] text-white/45"
        >
          {label}
        </label>
        <span className="text-[11px] text-white/30">
          {tags.length}/{max}
        </span>
      </div>

      <div
        className="group flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.035] px-3 py-2.5 transition focus-within:border-violet-400/50 hover:border-white/20"
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag, index) => (
          <span
            key={`${tag}-${index}`}
            className={`soul-chip ${
              variant === "accent" ? "soul-chip--accent" : ""
            } !gap-1.5 !py-1.5 pr-1.5`}
          >
            {tag}
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                remove(index);
              }}
              className="inline-flex h-5 w-5 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
              aria-label={`Remove ${tag}`}
            >
              <CloseIcon size={12} />
            </button>
          </span>
        ))}

        <input
          id={`${name}-input`}
          ref={inputRef}
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={() => commit(draft)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : undefined}
          className="min-w-[120px] flex-1 bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none"
          autoComplete="off"
        />
      </div>

      {available.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {available.slice(0, 8).map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => commit(suggestion)}
              className="inline-flex items-center gap-1 rounded-full border border-dashed border-white/10 px-2.5 py-1 text-[11px] text-white/45 transition hover:border-white/25 hover:text-white"
            >
              <PlusIcon size={10} />
              {suggestion}
            </button>
          ))}
        </div>
      ) : null}

      <input type="hidden" name={name} value={tags.join(", ")} />
    </div>
  );
}
