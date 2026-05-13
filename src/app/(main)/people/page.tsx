import Link from "next/link";
import { listPeople } from "@/lib/demo/queries";

export default function PeoplePage() {
  const people = listPeople();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">People</h1>
        <p className="text-sm text-zinc-400">Find collaborators and follow the builders.</p>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {people.map((p) => (
          <li key={p.id}>
            <Link
              href={`/u/${p.handle}`}
              className="block rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 hover:border-violet-500/40"
            >
              <p className="font-medium text-white">@{p.handle}</p>
              <p className="text-sm text-zinc-400">{p.display_name}</p>
              {p.skills?.length ? (
                <p className="mt-2 text-xs text-zinc-500">{p.skills.slice(0, 6).join(" · ")}</p>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
