export function DemoBanner() {
  return (
    <div className="rounded-lg border border-amber-500/35 bg-amber-500/10 px-3 py-2 text-sm text-amber-100">
      <span className="font-medium text-amber-50">Demo preview</span> — static sample data. Auth
      and persistence ship when this is wired to Supabase.
    </div>
  );
}
