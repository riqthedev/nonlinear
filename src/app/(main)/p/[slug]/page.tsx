import Link from "next/link";
import { notFound } from "next/navigation";
import { UpdateForm } from "@/components/UpdateForm";
import { DemoSubmitForm } from "@/components/DemoSubmitForm";
import { ReactionToggle } from "@/components/ReactionToggle";
import { isWeeklyPulseStale } from "@/lib/stale";
import { getCohort, getProjectBySlug, isDemoMemberOfProject } from "@/lib/demo/queries";

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ posted?: string }>;
}) {
  const { slug } = await params;
  const { posted } = await searchParams;
  const bundle = getProjectBySlug(slug);
  if (!bundle) notFound();

  const { project, members, updates, demoEvent, demoSubmission } = bundle;
  const cohort = getCohort();
  const membership = isDemoMemberOfProject(project.id);

  const lastUpdateAt = updates?.[0]?.created_at;
  const stale = lastUpdateAt ? isWeeklyPulseStale(lastUpdateAt) : false;

  return (
    <div className="space-y-8">
      {posted ? (
        <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
          Weekly pulse posted — it is live on the cohort feed.
        </p>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Link href="/projects" className="text-sm text-violet-400 hover:text-violet-300">
            ← Projects
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight text-white">{project.name}</h1>
            <span className="rounded-full border border-zinc-700 px-2 py-0.5 text-xs uppercase tracking-wide text-zinc-400">
              {project.status}
            </span>
            <ReactionToggle
              targetType="project"
              targetId={project.id}
              revalidatePath={`/p/${project.slug}`}
            />
          </div>
          {project.tagline ? (
            <p className="max-w-2xl text-lg text-zinc-300">{project.tagline}</p>
          ) : null}
          {stale ? (
            <p className="text-sm text-amber-200">
              No pulse in 7+ days — post an update so the cohort knows you are still shipping.
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-2 text-sm text-violet-300">
          {project.github_url ? (
            <a className="hover:text-white" href={project.github_url}>
              GitHub
            </a>
          ) : null}
          {project.demo_url ? (
            <a className="hover:text-white" href={project.demo_url}>
              Demo / deck
            </a>
          ) : null}
          {project.discord_url ? (
            <a className="hover:text-white" href={project.discord_url}>
              Chat
            </a>
          ) : null}
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Team</h2>
        <ul className="flex flex-wrap gap-2">
          {members.map((m) => (
            <li key={`${m.profiles.handle}-${m.role}`}>
              <Link
                href={`/u/${m.profiles.handle}`}
                className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-sm text-zinc-200 hover:border-violet-500/50"
              >
                @{m.profiles.handle}
                <span className="text-zinc-500"> · {m.role}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {membership && demoEvent ? (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Friday demo (week {demoEvent.week_number})
          </h2>
          <DemoSubmitForm
            demoEventId={demoEvent.id}
            projectId={project.id}
            weekNumber={demoEvent.week_number}
            initialPitch={demoSubmission?.pitch}
            initialMedia={demoSubmission?.media_url}
            initialDeck={demoSubmission?.deck_url}
          />
        </section>
      ) : null}

      {membership ? (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Weekly pulse
          </h2>
          <UpdateForm projectId={project.id} defaultWeek={cohort.current_week} />
        </section>
      ) : null}

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Timeline</h2>
        <ul className="space-y-3">
          {updates.length === 0 ? (
            <li className="text-sm text-zinc-500">No updates yet.</li>
          ) : (
            updates.map((u) => (
              <li
                key={u.id}
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 text-sm text-zinc-200"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="text-xs uppercase tracking-wide text-zinc-500">
                    Week {u.week_number} · {new Date(u.created_at).toLocaleDateString()}
                  </p>
                  <ReactionToggle
                    targetType="update"
                    targetId={u.id}
                    revalidatePath={`/p/${project.slug}`}
                  />
                </div>
                {u.shipped?.length ? (
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {u.shipped.map((s: string, i: number) => (
                      <li key={`${u.id}-s-${i}`}>{s}</li>
                    ))}
                  </ul>
                ) : null}
                {u.next_items?.length ? (
                  <div className="mt-3">
                    <p className="text-xs uppercase text-zinc-500">Next</p>
                    <ul className="mt-1 list-disc space-y-1 pl-5">
                      {u.next_items.map((s: string, i: number) => (
                        <li key={`${u.id}-n-${i}`}>{s}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {u.asks ? (
                  <p className="mt-3 text-zinc-300">
                    <span className="text-zinc-500">Ask: </span>
                    {u.asks}
                  </p>
                ) : null}
                {u.vibe ? <p className="mt-2 text-lg">{u.vibe}</p> : null}
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
