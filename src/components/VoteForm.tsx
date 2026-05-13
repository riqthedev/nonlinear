"use client";

import { useState } from "react";

type VoteFormProps = {
  demoEventId: string;
  projectId: string;
  weekNumber: number;
  defaultValue: number;
};

export function VoteForm(props: VoteFormProps) {
  const [value, setValue] = useState(props.defaultValue);

  return (
    <div
      className="flex flex-col items-end gap-1 text-sm"
      data-demo-event={props.demoEventId}
      data-demo-project={props.projectId}
      data-demo-week={props.weekNumber}
    >
      <form className="flex flex-wrap items-center gap-2" onSubmit={(e) => e.preventDefault()}>
        <label className="flex items-center gap-1 text-zinc-400">
          Your vote
          <select
            name="value"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="rounded-md border border-zinc-700 bg-zinc-950 px-2 py-1 text-zinc-100"
          >
            <option value={1}>1 — nice</option>
            <option value={2}>2 — strong</option>
            <option value={3}>3 — ship it</option>
          </select>
        </label>
        <button
          type="button"
          className="rounded-md bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-950 hover:bg-white"
        >
          Save
        </button>
      </form>
      <p className="max-w-[14rem] text-right text-[10px] text-zinc-500">
        Demo only — your selection is not saved.
      </p>
    </div>
  );
}
