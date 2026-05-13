import * as D from "./data";

export function getCohort() {
  return D.cohort;
}

export function getFeedEvents() {
  return [...D.feedEvents].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

export function getProjectsByIds(ids: string[]) {
  const set = new Set(ids);
  return D.projects.filter((p) => set.has(p.id)).map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
  }));
}

export function getProfilesByIds(ids: string[]) {
  const set = new Set(ids);
  return D.profiles.filter((p) => set.has(p.id)).map((p) => ({
    id: p.id,
    handle: p.handle,
    display_name: p.display_name,
  }));
}

export function listProjects() {
  return D.projects.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    tagline: p.tagline,
    status: p.status,
    created_at: p.created_at,
  }));
}

export function getProjectBySlug(slug: string) {
  const project = D.projects.find((p) => p.slug === slug);
  if (!project) return null;
  const members = D.projectMembers.filter((m) => m.project_id === project.id);
  const projectUpdates = [...D.updates]
    .filter((u) => u.project_id === project.id)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  const demoEvent =
    D.demoEvents.find(
      (e) => e.cohort_id === project.cohort_id && e.week_number === D.cohort.current_week,
    ) ?? null;
  const demoSubmission = demoEvent
    ? D.demoSubmissions.find(
        (s) => s.demo_event_id === demoEvent.id && s.project_id === project.id,
      ) ?? null
    : null;
  return {
    project: { ...project },
    members,
    updates: projectUpdates,
    demoEvent,
    demoSubmission,
  };
}

/** Demo viewer is always a "member" so UI shows collaboration affordances. */
export function isDemoMemberOfProject(projectId: string) {
  return D.projectMembers.some(
    (m) => m.project_id === projectId && m.user_id === D.demoViewer.id,
  );
}

export function getProfileByHandle(handle: string) {
  const profile = D.profiles.find((p) => p.handle === handle);
  if (!profile) return null;
  const rows = D.projectMembers
    .filter((m) => m.user_id === profile.id)
    .map((m) => {
      const proj = D.projects.find((p) => p.id === m.project_id);
      if (!proj) return null;
      return {
        role: m.role,
        projects: {
          name: proj.name,
          slug: proj.slug,
          tagline: proj.tagline,
          status: proj.status,
        },
      };
    })
    .filter(Boolean) as {
    role: string;
    projects: { name: string; slug: string; tagline: string | null; status: string };
  }[];
  return { profile: { ...profile }, projectRows: rows };
}

export function listPeople() {
  return D.profiles.map((p) => ({
    id: p.id,
    handle: p.handle,
    display_name: p.display_name,
    skills: [...p.skills],
    bio: p.bio,
  }));
}

export function getDemoWeek(weekNum: number) {
  const event = D.demoEvents.find((e) => e.week_number === weekNum) ?? null;
  if (!event) {
    return {
      event: null as (typeof D.demoEvents)[number] | null,
      subs: [] as (typeof D.demoSubmissions)[number][],
      votes: [] as (typeof D.votes)[number][],
    };
  }
  const subs = D.demoSubmissions.filter((s) => s.demo_event_id === event.id);
  const projectIds = new Set(subs.map((s) => s.project_id));
  const votes = D.votes.filter((v) => projectIds.has(v.project_id));
  return { event, subs, votes };
}

export function getFeedLinesForRecap() {
  return getFeedEvents().map(
    (e) => `- [${e.type}] ${e.title}${e.body ? `: ${e.body}` : ""}`,
  );
}
