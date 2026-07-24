-- ============================================================================
-- TrailSathi - Feedback table
-- ----------------------------------------------------------------------------
-- Stores public feedback collected from the in-app feedback widget.
-- Anonymous visitors may INSERT, but cannot SELECT (feedback is private to
-- the project owner, readable via the Supabase dashboard / service role).
-- Safe to re-run.
-- ============================================================================

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  message text not null,
  rating integer check (rating is null or (rating >= 1 and rating <= 5)),
  category text,
  email text,
  page_path text,
  user_agent text,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists feedback_created_at_idx on public.feedback (created_at desc);

alter table public.feedback enable row level security;

-- Allow anonymous (and authenticated) visitors to submit feedback only.
drop policy if exists "Public can submit feedback" on public.feedback;
create policy "Public can submit feedback"
on public.feedback
for insert
to anon, authenticated
with check (
  char_length(message) between 1 and 4000
);

-- No SELECT/UPDATE/DELETE policy is created, so feedback rows are not
-- readable by the anon key. Read them from the Supabase dashboard.

-- ============================================================================
-- DONE.
-- ============================================================================
