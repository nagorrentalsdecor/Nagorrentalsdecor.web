-- Run this SQL in your Supabase SQL Editor to enable dynamic content and settings persistence.

-- 1. Create the site_data table to store Key-Value pairs (Content, Settings, etc)
create table if not exists site_data (
  key text primary key,
  value jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable RLS
alter table site_data enable row level security;

-- 3. Create policies
-- Public Read: Everyone can read site content
create policy "Public read site_data" on site_data for select using (true);

-- Authenticated Insert/Update: Only if you have a way to authenticate. 
-- BUT since we are using supabaseAdmin (Service Role) in the API, we BYPASS these policies.
-- These policies are just a fallback if you ever use the client-side SDK.

-- Allow Service Role to do everything (enabled by default, but good to know)

-- 4. Initial Seed (Optional)
-- You can run this to seed initial content if empty, but your API will upsert it anyway.
