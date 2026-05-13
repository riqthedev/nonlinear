const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/** Server-only helper: compares last update time to wall clock at call time. */
export function isWeeklyPulseStale(lastUpdateIso: string): boolean {
  return Date.now() - new Date(lastUpdateIso).getTime() > WEEK_MS;
}
