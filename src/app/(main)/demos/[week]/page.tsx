import Link from "next/link";
import { VoteForm } from "@/components/VoteForm";
import { demoViewer } from "@/lib/demo/data";
import { getDemoWeek } from "@/lib/demo/queries";

function normalizeProject(
  projects: unknown,
): { name: string; slug: string } | null {
  if (!projects) return null;
  if (Array.isArray(projects)) {
    const first = projects[0];
    if (first && typeof first === "object" && "name" in first && "slug" in first) {
      return first as { name: string; slug: string };
    }
    return null;
  }
  if (typeof projects === "object" && "name" in projects && "slug" in projects) {
    return projects as { name: string; slug: string };
  }
  return null;
}

export default async function DemoWeekPage({
  params,
  searchParams,
}: {
  params: Promise<{ week: string }>;
  searchParams: Promise<{ submitted?: string }>;
}) {
  const { week: weekRaw } = await params;
  const { submitted } = await searchParams;
  const weekNum = Math.min(6, Math.max(1, parseInt(weekRaw, 10) || 1));

  const { event, subs, votes } = getDemoWeek(weekNum);

  if (!event) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">Week {weekNum} demos</h1>
        <p className="text-sm text-zinc-400">
          No demo event in the demo dataset for this week.
        </p>
        <Link href="/demos/1" className="text-sm text-violet-400 hover:text-violet-300">
          Go to week 1
        </Link>
      </div>
    );
  }

  const tally = new Map<string, number>();
  votes.forEach((v) => {
    tally.set(v.project_id, (tally.get(v.project_id) ?? 0) + v.value);
  });

  const mine = new Map<string, number>();
  votes
    .filter((v) => v.user_id === demoViewer.id)
    .forEach((v) => mine.set(v.project_id, v.value));

  return (
    <div className="space-y-6">
      {submitted ? (
        <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
          Demo submission saved. Good luck on Friday.
        </p>
      ) : null}
      <div>
        <p className="text-xs uppercase tracking-wide text-violet-400">Friday ops</p>
        <h1 className="text-2xl font-semibold text-white">{event.title}</h1>
        <p className="text-sm text-zinc-400">
          Submissions stay editable until you lock them manually in the database (Week 1
          pragmatism).
        </p>
      </div>

      <div className="space-y-4">
        {subs.length ? (
          subs.map((s) => {
            const proj = normalizeProject(s.projects);
            const score = tally.get(s.project_id) ?? 0;
            const defaultVote = mine.get(s.project_id) ?? 1;
            return (
              <article
                key={s.id}
                className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-medium text-white">
                      {proj ? (
                        <Link className="hover:text-violet-300" href={`/p/${proj.slug}`}>
                          {proj.name}
                        </Link>
                      ) : (
                        "Project"
                      )}
                    </h2>
                    <p className="text-xs text-zinc-500">Momentum score (sum of votes): {score}</p>
                  </div>
                  <VoteForm
                    demoEventId={event.id}
                    projectId={s.project_id}
                    weekNumber={weekNum}
                    defaultValue={defaultVote}
                  />
                </div>
                <p className="whitespace-pre-wrap text-sm text-zinc-300">{s.pitch}</p>
                <div className="flex flex-wrap gap-3 text-sm text-violet-300">
                  {s.media_url ? (
                    <a className="hover:text-white" href={s.media_url}>
                      Watch clip
                    </a>
                  ) : null}
                  {s.deck_url ? (
                    <a className="hover:text-white" href={s.deck_url}>
                      Deck
                    </a>
                  ) : null}
                </div>
              </article>
            );
          })
        ) : (
          <p className="text-sm text-zinc-500">No submissions yet for this week.</p>
        )}
      </div>
    </div>
  );
}
