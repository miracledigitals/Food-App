-- ==========================================
-- SOUS-CHEF PRO DATABASE SCHEMA
-- Copy and run this script in your Supabase SQL Editor
-- (Supabase Dashboard -> SQL Editor -> New Query)
-- ==========================================

-- 1. Create Profiles Table (extends Supabase Auth Users)
create table if not exists public.profiles (
    id uuid references auth.users on delete cascade primary key,
    full_name text,
    role text default 'Nutrition Enthusiast',
    calorie_target integer default 2000,
    protein_target integer default 130,
    carbs_target integer default 220,
    fats_target integer default 65,
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS for Profiles
alter table public.profiles enable row level security;

-- Profiles Policies
create policy "Allow users to read their own profile" 
on public.profiles for select 
using (auth.uid() = id);

create policy "Allow users to update their own profile" 
on public.profiles for update 
using (auth.uid() = id);

create policy "Allow users to insert their own profile" 
on public.profiles for insert 
with check (auth.uid() = id);


-- 2. Create Recipes Table
create table if not exists public.recipes (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users on delete cascade not null,
    name text not null,
    description text default '',
    calories integer default 0,
    protein integer default 0,
    carbs integer default 0,
    fats integer default 0,
    cook_time integer default 15,
    tags text[] default '{}',
    ingredients jsonb default '[]',
    instructions text[] default '{}',
    image_url text default './assets/placeholder_food.jpg',
    favorite boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS for Recipes
alter table public.recipes enable row level security;

-- Recipes Policies
create policy "Allow users to view their own recipes" 
on public.recipes for select 
using (auth.uid() = user_id);

create policy "Allow users to insert their own recipes" 
on public.recipes for insert 
with check (auth.uid() = user_id);

create policy "Allow users to update their own recipes" 
on public.recipes for update 
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Allow users to delete their own recipes" 
on public.recipes for delete 
using (auth.uid() = user_id);


-- 3. Create Weekly Planner Table
create table if not exists public.weekly_planner (
    user_id uuid references auth.users on delete cascade not null,
    day_of_week text not null,
    meal_type text not null,
    recipe_id uuid references public.recipes on delete set null,
    custom_meal_data jsonb default null,
    created_at timestamp with time zone default timezone('utc'::text, now()),
    primary key (user_id, day_of_week, meal_type)
);

-- Enable RLS for Weekly Planner
alter table public.weekly_planner enable row level security;

-- Weekly Planner Policies
create policy "Allow users to view their own planner slots" 
on public.weekly_planner for select 
using (auth.uid() = user_id);

create policy "Allow users to insert their own planner slots" 
on public.weekly_planner for insert 
with check (auth.uid() = user_id);

create policy "Allow users to update their own planner slots" 
on public.weekly_planner for update 
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Allow users to delete their own planner slots" 
on public.weekly_planner for delete 
using (auth.uid() = user_id);


-- 4. Create Logged Meals Table
create table if not exists public.logged_meals (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users on delete cascade not null,
    name text not null,
    calories integer default 0,
    protein integer default 0,
    carbs integer default 0,
    fats integer default 0,
    tags text[] default '{}',
    timestamp timestamp with time zone default timezone('utc'::text, now()),
    meal_type text not null
);

-- Enable RLS for Logged Meals
alter table public.logged_meals enable row level security;

-- Logged Meals Policies
create policy "Allow users to view their own logs" 
on public.logged_meals for select 
using (auth.uid() = user_id);

create policy "Allow users to insert their own logs" 
on public.logged_meals for insert 
with check (auth.uid() = user_id);

create policy "Allow users to delete their own logs" 
on public.logged_meals for delete 
using (auth.uid() = user_id);


-- 5. Create Reminders Table
create table if not exists public.reminders (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users on delete cascade not null,
    text text not null,
    completed boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS for Reminders
alter table public.reminders enable row level security;

-- Reminders Policies
create policy "Allow users to view their own reminders" 
on public.reminders for select 
using (auth.uid() = user_id);

create policy "Allow users to insert their own reminders" 
on public.reminders for insert 
with check (auth.uid() = user_id);

create policy "Allow users to update their own reminders" 
on public.reminders for update 
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Allow users to delete their own reminders" 
on public.reminders for delete 
using (auth.uid() = user_id);
