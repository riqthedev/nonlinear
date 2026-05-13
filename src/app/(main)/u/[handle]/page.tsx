import Link from "next/link";
import { notFound } from "next/navigation";
import { getProfileByHandle } from "@/lib/demo/queries";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const row = getProfileByHandle(handle);
  if (!row) notFound();

  const { profile, projectRows } = row;

  return (
    <div className="space-y-8">
      <div>
        <Link href="/people" className="text-sm text-violet-400 hover:text-violet-300">
          ← People
        </Link>
        <h1 className="mt-2 text-3xl font-semibold text-white">@{profile.handle}</h1>
        <p className="text-lg text-zinc-300">{profile.display_name}</p>
        {profile.bio ? <p className="mt-2 max-w-2xl text-sm text-zinc-400">{profile.bio}</p> : null}
        {profile.skills?.length ? (
          <p className="mt-3 text-sm text-zinc-500">{profile.skills.join(" · ")}</p>
        ) : null}
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Projects</h2>
        <ul className="space-y-2">
          {projectRows.length === 0 ? (
            <li className="text-sm text-zinc-500">No public projects yet.</li>
          ) : (
            projectRows.map((row) => (
              <li key={row.projects.slug}>
                <Link
                  href={`/p/${row.projects.slug}`}
                  className="block rounded-lg border border-zinc-800 bg-zinc-900/40 p-3 hover:border-violet-500/40"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-white">{row.projects.name}</p>
                    <span className="text-xs uppercase text-zinc-500">{row.role}</span>
                  </div>
                  {row.projects.tagline ? (
                    <p className="text-sm text-zinc-400">{row.projects.tagline}</p>
                  ) : null}
                </Link>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
