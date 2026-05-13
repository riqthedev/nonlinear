# Shipline Week 1 build (blocked: enable Agent mode)

Your Cursor session is in **Plan mode**, which only allows editing markdown/canvas files here. Non-markdown implementation edits were rejected.

**To let the assistant create the app files:** turn off Plan-only mode or accept switching to **Agent** mode, then say **“implement Week 1”** again.

## What is already in the repo

- Next.js 16 (App Router) + TypeScript + Tailwind v4 under the repo root (`shipline` package name in `package.json`).
- `@supabase/supabase-js` and `@supabase/ssr` are installed.

## What we will add next (once Agent mode is on)

1. `supabase/migrations/001_init.sql` — Postgres schema, seed cohort + week 1 demo event, `handle_new_user` trigger, RLS.
2. `src/lib/supabase/{client,server,middleware}.ts` + root `src/middleware.ts` — cookie session refresh + redirect unauthenticated users to `/login`.
3. `src/app/login/page.tsx`, `src/app/auth/callback/route.ts` — magic link auth.
4. Pulse home, `/projects`, `/projects/new`, `/p/[slug]`, `/demos/[week]`, `/people`, `/u/[handle]` — server components + server actions.
5. `.env.example` — `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, optional `OPENAI_API_KEY`.
6. Optional `src/app/api/ai/recap/route.ts` — cohort recap when OpenAI key is set.

## Supabase setup (you)

1. Create a Supabase project; enable **Email** auth (magic link).
2. Add redirect URL: `http://localhost:3000/auth/callback` (and production URL later).
3. Run the SQL migration from the repo (once the file exists) in the SQL editor.
4. Copy **Project URL** and **anon key** into `.env.local`.

## Postgres trigger note

On PostgreSQL 11+, use:

```sql
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
```

If your instance errors on `execute function`, use `execute procedure` (older syntax) per your Postgres version.

After Agent mode is enabled, the assistant will apply the migration file and the full Next.js routes in one pass.

---

## Appendix: full `001_init.sql` (copy into Supabase SQL editor)

Save as `supabase/migrations/001_init.sql` in the repo when Agent mode is on.

```sql
create extension if not exists "pgcrypto";

create table public.cohorts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  current_week int not null default 1 check (current_week between 1 and 6),
  created_at timestamptz not null default now()
);

insert into public.cohorts (slug, name, current_week)
values ('default', 'Hackathon cohort', 1);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  handle text not null unique,
  skills text[] not null default '{}',
  bio text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table public.cohort_members (
  cohort_id uuid not null references public.cohorts (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role text not null default 'member' check (role in ('member', 'organizer')),
  joined_at timestamptz not null default now(),
  primary key (cohort_id, user_id)
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references public.cohorts (id) on delete cascade,
  slug text not null,
  name text not null,
  tagline text,
  status text not null default 'building' check (status in ('exploring', 'building', 'demo-ready')),
  looking_for text[] not null default '{}',
  github_url text,
  demo_url text,
  discord_url text,
  pulse_cached int not null default 0,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (cohort_id, slug)
);

create index projects_cohort_idx on public.projects (cohort_id);
create index projects_created_idx on public.projects (cohort_id, created_at desc);

create table public.project_members (
  project_id uuid not null references public.projects (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'member')),
  primary key (project_id, user_id)
);

create table public.updates (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  week_number int not null check (week_number between 1 and 6),
  shipped text[] not null default '{}',
  next_items text[] not null default '{}',
  asks text,
  vibe text,
  proof_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index updates_project_week_idx on public.updates (project_id, week_number);

create table public.demo_events (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references public.cohorts (id) on delete cascade,
  week_number int not null check (week_number between 1 and 6),
  title text not null,
  submissions_close_at timestamptz,
  voting_open_at timestamptz,
  voting_close_at timestamptz,
  created_at timestamptz not null default now(),
  unique (cohort_id, week_number)
);

insert into public.demo_events (cohort_id, week_number, title)
select id, 1, 'Week 1 demos' from public.cohorts where slug = 'default';

create table public.demo_submissions (
  id uuid primary key default gen_random_uuid(),
  demo_event_id uuid not null references public.demo_events (id) on delete cascade,
  project_id uuid not null references public.projects (id) on delete cascade,
  pitch text not null,
  media_url text,
  deck_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (demo_event_id, project_id)
);

create table public.votes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  demo_event_id uuid not null references public.demo_events (id) on delete cascade,
  project_id uuid not null references public.projects (id) on delete cascade,
  value int not null default 1 check (value >= 1 and value <= 3),
  created_at timestamptz not null default now(),
  unique (user_id, demo_event_id, project_id)
);

create table public.reactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  target_type text not null check (target_type in ('update', 'project')),
  target_id uuid not null,
  kind text not null default 'ship',
  created_at timestamptz not null default now(),
  unique (user_id, target_type, target_id, kind)
);

create table public.feed_events (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references public.cohorts (id) on delete cascade,
  type text not null,
  project_id uuid references public.projects (id) on delete set null,
  actor_id uuid references public.profiles (id) on delete set null,
  title text not null,
  body text,
  payload jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index feed_cohort_time_idx on public.feed_events (cohort_id, created_at desc);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare c_id uuid; base_handle text; final_handle text;
begin
  select id into c_id from public.cohorts where slug = 'default' limit 1;
  base_handle := regexp_replace(lower(split_part(new.email, '@', 1)), '[^a-z0-9_]', '_', 'g');
  if base_handle is null or length(base_handle) < 2 then base_handle := 'builder'; end if;
  final_handle := base_handle || '_' || substr(replace(new.id::text, '-', ''), 1, 8);
  insert into public.profiles (id, display_name, handle) values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    final_handle
  );
  if c_id is not null then
    insert into public.cohort_members (cohort_id, user_id, role) values (c_id, new.id, 'member');
  end if;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.cohort_members enable row level security;
alter table public.projects enable row level security;
alter table public.project_members enable row level security;
alter table public.updates enable row level security;
alter table public.demo_events enable row level security;
alter table public.demo_submissions enable row level security;
alter table public.votes enable row level security;
alter table public.reactions enable row level security;
alter table public.feed_events enable row level security;
alter table public.cohorts enable row level security;

create or replace function public.is_cohort_member(c_id uuid, u_id uuid)
returns boolean language sql stable as $$
  select exists (
    select 1 from public.cohort_members cm
    where cm.cohort_id = c_id and cm.user_id = u_id
  );
$$;

create policy cohorts_select on public.cohorts for select to authenticated
using (public.is_cohort_member(cohorts.id, auth.uid()));

create policy profiles_select on public.profiles for select to authenticated using (true);
create policy profiles_update_self on public.profiles for update to authenticated
using (id = auth.uid()) with check (id = auth.uid());

create policy cohort_members_select on public.cohort_members for select to authenticated
using (public.is_cohort_member(cohort_members.cohort_id, auth.uid()));

create policy projects_select on public.projects for select to authenticated
using (public.is_cohort_member(projects.cohort_id, auth.uid()));
create policy projects_insert on public.projects for insert to authenticated
with check (public.is_cohort_member(projects.cohort_id, auth.uid()));
create policy projects_update on public.projects for update to authenticated
using (
  public.is_cohort_member(projects.cohort_id, auth.uid())
  and (
    exists (select 1 from public.project_members pm where pm.project_id = projects.id and pm.user_id = auth.uid())
    or exists (select 1 from public.cohort_members cm where cm.cohort_id = projects.cohort_id and cm.user_id = auth.uid() and cm.role = 'organizer')
  )
) with check (public.is_cohort_member(projects.cohort_id, auth.uid()));

create policy project_members_select on public.project_members for select to authenticated
using (exists (select 1 from public.projects p where p.id = project_members.project_id and public.is_cohort_member(p.cohort_id, auth.uid())));
create policy project_members_insert on public.project_members for insert to authenticated
with check (
  exists (
    select 1 from public.projects p
    where p.id = project_members.project_id
      and public.is_cohort_member(p.cohort_id, auth.uid())
      and (exists (select 1 from public.project_members pm where pm.project_id = p.id and pm.user_id = auth.uid()) or p.created_by = auth.uid())
  )
);

create policy updates_select on public.updates for select to authenticated
using (exists (select 1 from public.projects p where p.id = updates.project_id and public.is_cohort_member(p.cohort_id, auth.uid())));
create policy updates_insert on public.updates for insert to authenticated
with check (
  exists (
    select 1 from public.projects p
    join public.project_members pm on pm.project_id = p.id
    where p.id = updates.project_id and pm.user_id = auth.uid() and public.is_cohort_member(p.cohort_id, auth.uid())
  )
);
create policy updates_update on public.updates for update to authenticated
using (author_id = auth.uid()) with check (author_id = auth.uid());

create policy demo_events_select on public.demo_events for select to authenticated
using (public.is_cohort_member(demo_events.cohort_id, auth.uid()));

create policy demo_submissions_select on public.demo_submissions for select to authenticated
using (exists (select 1 from public.demo_events de where de.id = demo_submissions.demo_event_id and public.is_cohort_member(de.cohort_id, auth.uid())));
create policy demo_submissions_write on public.demo_submissions for insert to authenticated
with check (
  exists (
    select 1 from public.demo_events de
    join public.project_members pm on pm.project_id = demo_submissions.project_id
    where de.id = demo_submissions.demo_event_id and pm.user_id = auth.uid() and public.is_cohort_member(de.cohort_id, auth.uid())
  )
);
create policy demo_submissions_update on public.demo_submissions for update to authenticated
using (
  exists (
    select 1 from public.demo_events de
    join public.project_members pm on pm.project_id = demo_submissions.project_id
    where de.id = demo_submissions.demo_event_id and pm.user_id = auth.uid() and public.is_cohort_member(de.cohort_id, auth.uid())
  )
)
with check (
  exists (
    select 1 from public.demo_events de
    join public.project_members pm on pm.project_id = demo_submissions.project_id
    where de.id = demo_submissions.demo_event_id and pm.user_id = auth.uid() and public.is_cohort_member(de.cohort_id, auth.uid())
  )
);

create policy votes_select on public.votes for select to authenticated
using (exists (select 1 from public.demo_events de where de.id = votes.demo_event_id and public.is_cohort_member(de.cohort_id, auth.uid())));
create policy votes_write on public.votes for insert to authenticated with check (user_id = auth.uid());
create policy votes_update on public.votes for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy reactions_select on public.reactions for select to authenticated using (true);
create policy reactions_write on public.reactions for insert to authenticated with check (user_id = auth.uid());
create policy reactions_delete on public.reactions for delete to authenticated using (user_id = auth.uid());

create policy feed_select on public.feed_events for select to authenticated
using (public.is_cohort_member(feed_events.cohort_id, auth.uid()));
create policy feed_insert on public.feed_events for insert to authenticated
with check (actor_id = auth.uid() and public.is_cohort_member(feed_events.cohort_id, auth.uid()));
```
