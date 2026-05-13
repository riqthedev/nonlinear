"use client";

type DemoSubmitFormProps = {
  demoEventId: string;
  projectId: string;
  weekNumber: number;
  initialPitch?: string | null;
  initialMedia?: string | null;
  initialDeck?: string | null;
};

export function DemoSubmitForm(props: DemoSubmitFormProps) {
  return (
    <div
      className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4"
      data-demo-event={props.demoEventId}
      data-demo-project={props.projectId}
    >
      <p className="text-sm text-zinc-400">
        Demo submission is read-only here. The live app saves rows to{" "}
        <span className="font-mono text-zinc-500">demo_submissions</span>.
      </p>
      <div className="pointer-events-none space-y-3 opacity-50">
        <textarea
          readOnly
          rows={4}
          defaultValue={props.initialPitch ?? ""}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white"
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            readOnly
            defaultValue={props.initialMedia ?? ""}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white"
          />
          <input
            readOnly
            defaultValue={props.initialDeck ?? ""}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white"
          />
        </div>
        <button
          type="button"
          disabled
          className="w-full rounded-lg bg-violet-600/50 py-2 text-sm font-medium text-white"
        >
          Save Week {props.weekNumber} demo
        </button>
      </div>
    </div>
  );
}
