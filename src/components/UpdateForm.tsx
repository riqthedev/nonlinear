"use client";

type UpdateFormProps = {
  projectId: string;
  defaultWeek: number;
};

export function UpdateForm(props: UpdateFormProps) {
  return (
    <div
      className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4"
      data-demo-project={props.projectId}
    >
      <p className="text-sm text-zinc-400">
        Weekly pulse is disabled in the demo build. In production this posts to Supabase for the
        current cohort week.
      </p>
      <div className="pointer-events-none space-y-3 opacity-40">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs text-zinc-500">Week (1–6)</label>
            <input
              type="number"
              readOnly
              defaultValue={props.defaultWeek}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white"
            />
          </div>
        </div>
        <textarea
          readOnly
          rows={3}
          defaultValue={"- Shipped auth polish\n- Demo voting UI"}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white"
        />
      </div>
    </div>
  );
}
