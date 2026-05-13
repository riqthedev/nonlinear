import Link from "next/link";
import { demoViewer } from "@/lib/demo/data";

export function AppShell({ children }: { children: React.ReactNode }) {
  const label = demoViewer.display_name;

  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-950 text-zinc-100">
      <header className="sticky top-0 z-20 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-semibold tracking-tight text-zinc-50">
              Shipline
            </Link>
            <span className="rounded border border-violet-500/40 bg-violet-500/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-violet-200">
              Demo
            </span>
            <nav className="hidden items-center gap-4 text-sm text-zinc-400 sm:flex">
              <Link className="hover:text-zinc-100" href="/">
                Pulse
              </Link>
              <Link className="hover:text-zinc-100" href="/projects">
                Projects
              </Link>
              <Link className="hover:text-zinc-100" href="/demos/1">
                Demos
              </Link>
              <Link className="hover:text-zinc-100" href="/people">
                People
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Link
              href={`/u/${demoViewer.handle}`}
              className="hidden max-w-[10rem] truncate text-zinc-400 hover:text-zinc-100 sm:inline"
            >
              {label}
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}
