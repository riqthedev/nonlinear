/** Fixed UUID-shaped ids for stable keys in React lists. */
export const cohort = {
  id: "10000000-0000-4000-8000-000000000001",
  slug: "default",
  name: "Boston cohort",
  current_week: 1,
};

export const profiles = [
  {
    id: "20000000-0000-4000-8000-000000000010",
    handle: "alex",
    display_name: "Alex Rivera",
    skills: ["Next.js", "Product", "Design systems"],
    bio: "Shipping cohort tools and living in the feed.",
    created_at: "2026-05-01T12:00:00.000Z",
  },
  {
    id: "20000000-0000-4000-8000-000000000011",
    handle: "sam",
    display_name: "Sam Okonkwo",
    skills: ["Go", "Infra", "Realtime"],
    bio: "Making backends boring in the best way.",
    created_at: "2026-05-02T09:00:00.000Z",
  },
  {
    id: "20000000-0000-4000-8000-000000000012",
    handle: "jordan",
    display_name: "Jordan Lee",
    skills: ["Motion", "Brand", "Figma"],
    bio: "Friday demo clips and narrative.",
    created_at: "2026-05-03T15:30:00.000Z",
  },
] as const;

export const projects = [
  {
    id: "30000000-0000-4000-8000-000000000020",
    cohort_id: cohort.id,
    slug: "shipline",
    name: "Shipline",
    tagline: "Cohort pulse + Friday demos without the Jira tax.",
    status: "building" as const,
    looking_for: ["design", "GTM"],
    github_url: "https://github.com/example/shipline",
    demo_url: "https://example.com/deck",
    discord_url: null as string | null,
    pulse_cached: 12,
    created_by: profiles[0].id,
    created_at: "2026-05-04T10:00:00.000Z",
  },
  {
    id: "30000000-0000-4000-8000-000000000021",
    cohort_id: cohort.id,
    slug: "demo-radar",
    name: "Demo Radar",
    tagline: "Live agenda + voting surface for hybrid demo days.",
    status: "demo-ready" as const,
    looking_for: ["mobile"],
    github_url: null as string | null,
    demo_url: null as string | null,
    discord_url: "https://discord.gg/example",
    pulse_cached: 8,
    created_by: profiles[1].id,
    created_at: "2026-05-05T14:20:00.000Z",
  },
  {
    id: "30000000-0000-4000-8000-000000000022",
    cohort_id: cohort.id,
    slug: "nexus-pm",
    name: "Nexus",
    tagline: "Lightweight partner CRM for studio founders.",
    status: "exploring" as const,
    looking_for: ["sales", "design"],
    github_url: "https://github.com/example/nexus",
    demo_url: null as string | null,
    discord_url: null as string | null,
    pulse_cached: 3,
    created_by: profiles[2].id,
    created_at: "2026-05-06T18:00:00.000Z",
  },
] as const;

export const projectMembers: {
  project_id: string;
  user_id: string;
  role: "owner" | "member";
  profiles: { handle: string; display_name: string };
}[] = [
  {
    project_id: projects[0].id,
    user_id: profiles[0].id,
    role: "owner",
    profiles: { handle: profiles[0].handle, display_name: profiles[0].display_name },
  },
  {
    project_id: projects[0].id,
    user_id: profiles[1].id,
    role: "member",
    profiles: { handle: profiles[1].handle, display_name: profiles[1].display_name },
  },
  {
    project_id: projects[1].id,
    user_id: profiles[1].id,
    role: "owner",
    profiles: { handle: profiles[1].handle, display_name: profiles[1].display_name },
  },
  {
    project_id: projects[1].id,
    user_id: profiles[2].id,
    role: "member",
    profiles: { handle: profiles[2].handle, display_name: profiles[2].display_name },
  },
  {
    project_id: projects[2].id,
    user_id: profiles[2].id,
    role: "owner",
    profiles: { handle: profiles[2].handle, display_name: profiles[2].display_name },
  },
];

export const updates = [
  {
    id: "40000000-0000-4000-8000-000000000040",
    project_id: projects[0].id,
    author_id: profiles[0].id,
    week_number: 1,
    shipped: ["Pulse home + feed cards", "Magic link → demo mode switch"],
    next_items: ["Demo voting polish", "People discovery"],
    asks: "Looking for a motion designer for the Friday clip.",
    vibe: "🔥",
    proof_url: "https://example.com/loom/shipline",
    created_at: "2026-05-12T16:00:00.000Z",
    updated_at: "2026-05-12T16:00:00.000Z",
  },
  {
    id: "40000000-0000-4000-8000-000000000041",
    project_id: projects[1].id,
    author_id: profiles[1].id,
    week_number: 1,
    shipped: ["Agenda API sketch", "WebRTC spike"],
    next_items: ["Latency budget", "Fallback dial-in"],
    asks: null as string | null,
    vibe: "🙂",
    proof_url: null as string | null,
    created_at: "2026-05-11T11:00:00.000Z",
    updated_at: "2026-05-11T11:00:00.000Z",
  },
] as const;

export const demoEvents = [
  {
    id: "50000000-0000-4000-8000-000000000050",
    cohort_id: cohort.id,
    week_number: 1,
    title: "Week 1 — First demos",
    starts_at: "2026-05-16T23:00:00.000Z",
    created_at: "2026-05-01T00:00:00.000Z",
  },
] as const;

export const demoSubmissions = [
  {
    id: "60000000-0000-4000-8000-000000000060",
    demo_event_id: demoEvents[0].id,
    project_id: projects[0].id,
    pitch:
      "Shipline makes shipping legible for fast cohorts: pulse, weekly updates, and demo prep in one surface — optimized for Friday energy, not backlog grooming.",
    media_url: "https://example.com/clip/shipline",
    deck_url: "https://example.com/deck/shipline",
    created_at: "2026-05-10T20:00:00.000Z",
    updated_at: "2026-05-10T20:00:00.000Z",
    projects: { name: projects[0].name, slug: projects[0].slug },
  },
  {
    id: "60000000-0000-4000-8000-000000000061",
    demo_event_id: demoEvents[0].id,
    project_id: projects[1].id,
    pitch:
      "Demo Radar is the live runway: ordered slots, quick reactions, and a fair voting strip so hybrid audiences stay engaged.",
    media_url: null as string | null,
    deck_url: "https://example.com/deck/radar",
    created_at: "2026-05-10T21:00:00.000Z",
    updated_at: "2026-05-10T21:00:00.000Z",
    projects: { name: projects[1].name, slug: projects[1].slug },
  },
] as const;

export const votes = [
  {
    project_id: projects[0].id,
    value: 3,
    user_id: profiles[1].id,
  },
  {
    project_id: projects[0].id,
    value: 2,
    user_id: profiles[2].id,
  },
  {
    project_id: projects[1].id,
    value: 2,
    user_id: profiles[0].id,
  },
] as const;

export const feedEvents = [
  {
    id: "70000000-0000-4000-8000-000000000070",
    cohort_id: cohort.id,
    type: "weekly_update",
    title: "Shipline: Week 1 pulse",
    body: "Pulse home + feed cards · Magic link → demo mode switch",
    created_at: "2026-05-12T16:05:00.000Z",
    payload: { update_id: updates[0].id, week_number: 1 } as Record<string, unknown>,
    project_id: projects[0].id,
    actor_id: profiles[0].id,
  },
  {
    id: "70000000-0000-4000-8000-000000000071",
    cohort_id: cohort.id,
    type: "demo_submitted",
    title: "Demo Radar submitted a demo",
    body: "Demo Radar is the live runway: ordered slots, quick reactions…",
    created_at: "2026-05-10T21:10:00.000Z",
    payload: { demo_event_id: demoEvents[0].id, week_number: 1 } as Record<string, unknown>,
    project_id: projects[1].id,
    actor_id: profiles[1].id,
  },
  {
    id: "70000000-0000-4000-8000-000000000072",
    cohort_id: cohort.id,
    type: "project_created",
    title: "New project: Nexus",
    body: "Lightweight partner CRM for studio founders.",
    created_at: "2026-05-06T18:05:00.000Z",
    payload: { slug: projects[2].slug } as Record<string, unknown>,
    project_id: projects[2].id,
    actor_id: profiles[2].id,
  },
] as const;

/** Persona shown in the shell — matches first profile. */
export const demoViewer = profiles[0];
