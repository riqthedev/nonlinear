import Link from "next/link";
import { listProjects } from "@/lib/demo/queries";

export default function ProjectsPage() {
  const projects = listProjects();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Projects</h1>
          <p className="text-sm text-zinc-400">Discover what teams are building this week.</p>
        </div>
        <Link
          href="/projects/new"
          className="inline-flex items-center justify-center rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"
        >
          New project
        </Link>
      </div>
      <ul className="space-y-3">
        {projects.length === 0 ? (
          <li className="rounded-xl border border-dashed border-zinc-700 p-8 text-center text-sm text-zinc-400">
            No projects in the demo dataset.
          </li>
        ) : (
          projects.map((p) => (
            <li key={p.id}>
              <Link
                href={`/p/${p.slug}`}
                className="block rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 transition hover:border-violet-500/40 hover:bg-zinc-900"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-base font-medium text-white">{p.name}</p>
                    {p.tagline ? <p className="text-sm text-zinc-400">{p.tagline}</p> : null}
                  </div>
                  <span className="rounded-full border border-zinc-700 px-2 py-0.5 text-xs uppercase tracking-wide text-zinc-400">
                    {p.status}
                  </span>
                </div>
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
