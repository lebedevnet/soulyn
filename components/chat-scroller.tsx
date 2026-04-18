"use client";

import { useEffect, useRef, type ReactNode } from "react";

type ChatScrollerProps = {
  children: ReactNode;
  trigger?: string | number;
};

export default function ChatScroller({ children, trigger }: ChatScrollerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    node.scrollTo({ top: node.scrollHeight, behavior: "smooth" });
  }, [trigger]);

  return (
    <div
      ref={ref}
      className="flex-1 overflow-y-auto px-4 py-6 sm:px-6"
      style={{ scrollbarGutter: "stable" }}
    >
      {children}
    </div>
  );
}
