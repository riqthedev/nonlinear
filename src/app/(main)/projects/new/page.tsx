import Link from "next/link";

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/projects" className="text-sm text-violet-400 hover:text-violet-300">
          ← Projects
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-white">New project</h1>
        <p className="text-sm text-zinc-400">
          In the full app this flow creates a row in Supabase and adds you as owner. The demo
          only includes sample projects.
        </p>
      </div>
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 text-sm text-zinc-300">
        <p>
          Browse existing sample projects on the{" "}
          <Link href="/projects" className="text-violet-400 hover:text-violet-300">
            projects list
          </Link>{" "}
          or open{" "}
          <Link href="/p/shipline" className="text-violet-400 hover:text-violet-300">
            Shipline
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
