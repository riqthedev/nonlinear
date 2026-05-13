"use client";

import { useCallback, useState } from "react";

export function ReactionToggle({
  targetType,
  targetId,
}: {
  targetType: "update" | "project";
  targetId: string;
  /** Unused in demo — kept so call sites stay stable when wiring Supabase again. */
  revalidatePath: string;
}) {
  const [on, setOn] = useState(false);

  const toggle = useCallback(() => {
    setOn((v) => !v);
  }, []);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label={`Ship it for ${targetType} ${targetId}`}
      className={
        on
          ? "inline-flex shrink-0 rounded-full border border-violet-500 bg-violet-600/30 px-3 py-1 text-xs font-medium text-violet-100 hover:bg-violet-600/40"
          : "inline-flex shrink-0 rounded-full border border-zinc-600 bg-zinc-950 px-3 py-1 text-xs font-medium text-zinc-200 hover:border-violet-500 hover:text-white"
      }
    >
      Ship it{on ? " ✓" : ""}
    </button>
  );
}
