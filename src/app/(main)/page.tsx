import Link from "next/link";
import { ReactionToggle } from "@/components/ReactionToggle";
import {
  getFeedEvents,
  getProfilesByIds,
  getProjectsByIds,
} from "@/lib/demo/queries";

type FeedRow = (ReturnType<typeof getFeedEvents>[number]);

export default function PulsePage() {
  const rows = getFeedEvents() as FeedRow[];
  const projectIds = [...new Set(rows.map((r) => r.project_id).filter(Boolean))] as string[];
  const actorIds = [...new Set(rows.map((r) => r.actor_id).filter(Boolean))] as string[];

  const projects = getProjectsByIds(projectIds);
  const actors = getProfilesByIds(actorIds);

  const projectMap = new Map(projects.map((p) => [p.id, p]));
  const actorMap = new Map(actors.map((a) => [a.id, a]));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Cohort pulse</h1>
          <p className="text-sm text-zinc-400">
            What shipped, who is demo-ready, and where momentum is clustering.
          </p>
        </div>
        <Link
          href="/projects/new"
          className="inline-flex items-center justify-center rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"
        >
          New project
        </Link>
      </div>

      <div className="space-y-3">
        {rows.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900/40 p-8 text-center text-sm text-zinc-400">
            No signals in the demo dataset.
          </div>
        ) : (
          rows.map((ev) => {
            const project = ev.project_id ? projectMap.get(ev.project_id) : undefined;
            const actor = ev.actor_id ? actorMap.get(ev.actor_id) : undefined;
            const payload = ev.payload ?? {};
            const updateId =
              typeof payload.update_id === "string" ? payload.update_id : undefined;
            const reactionTarget =
              updateId != null
                ? { type: "update" as const, id: updateId }
                : ev.project_id
                  ? { type: "project" as const, id: ev.project_id }
                  : null;

            return (
              <article
                key={ev.id}
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 shadow-sm shadow-black/20"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wide text-zinc-500">
                      {ev.type.replace(/_/g, " ")}
                    </p>
                    <h2 className="text-base font-medium text-zinc-50">{ev.title}</h2>
                    {ev.body ? (
                      <p className="text-sm text-zinc-400 line-clamp-3">{ev.body}</p>
                    ) : null}
                    <p className="text-xs text-zinc-500">
                      {actor ? (
                        <>
                          <Link
                            href={`/u/${actor.handle}`}
                            className="text-violet-400 hover:text-violet-300"
                          >
                            @{actor.handle}
                          </Link>
                          <span> · </span>
                        </>
                      ) : null}
                      <time dateTime={ev.created_at}>
                        {new Date(ev.created_at).toLocaleString()}
                      </time>
                      {project ? (
                        <>
                          <span> · </span>
                          <Link
                            href={`/p/${project.slug}`}
                            className="text-violet-400 hover:text-violet-300"
                          >
                            {project.name}
                          </Link>
                        </>
                      ) : null}
                    </p>
                  </div>
                  {reactionTarget ? (
                    <ReactionToggle
                      targetType={reactionTarget.type}
                      targetId={reactionTarget.id}
                      revalidatePath="/"
                    />
                  ) : null}
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
