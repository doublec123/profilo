# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/b9bc1f30-28c9-43b7-a40c-31e1dd7ce7eb

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/b9bc1f30-28c9-43b7-a40c-31e1dd7ce7eb) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Admin panel & Supabase setup

- The admin console lives at `/admin-iw`. It reuses the same neon styling and lets you manage skills, experience, certificates, and projects in Supabase.
- The public sections (`Skills`, `Experience`, `Certificates`, `Projects`) read directly from Supabase, so anything you add/remove in the dashboard instantly reflects on the homepage. Certificates support uploading a proof image that lives in Supabase Storage.
- Guard access with two environment variables: set `VITE_ADMIN_USERNAME` and `VITE_ADMIN_PASSWORD` in `.env`, then log in at `/admin-iw`. Sessions persist per-tab using `sessionStorage`.
- The contact form sends real emails via EmailJS. Create a free EmailJS account, configure a service + template, and drop the service ID, template ID, and public key into the env vars listed below. Messages go straight to `ilesomari9@gmail.com` and include the phone number `+213557550841`.
- Copy `.env.example` to `.env` and add your Supabase URL + anon key so the client can connect:

  ```sh
  cp .env.example .env
  ```

- Update the `.env` file with your Supabase values plus the admin credentials and email service keys:

  ```env
  VITE_SUPABASE_URL=your-project-url
  VITE_SUPABASE_ANON_KEY=your-anon-key
  VITE_ADMIN_USERNAME=your-admin-user
  VITE_ADMIN_PASSWORD=super-secret-password
  VITE_EMAILJS_SERVICE_ID=your-emailjs-service-id
  VITE_EMAILJS_TEMPLATE_ID=your-emailjs-template-id
  VITE_EMAILJS_PUBLIC_KEY=your-emailjs-public-key
  ```

- Start the dev server with `npm run dev`, then hit `http://localhost:5173/admin-iw` to access the dashboard.

### SQL schema for Supabase

Paste the snippet below into the Supabase SQL Editor to create the required tables plus (developer-only) policies so the anon key can read/write. Replace the policies with something stricter (or gate the route with Supabase Auth) before you deploy.

```sql
create extension if not exists "pgcrypto";

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  proficiency smallint not null check (proficiency between 0 and 100),
  summary text,
  created_at timestamptz not null default now()
);

create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  role text not null,
  company text not null,
  start_date date not null,
  end_date date,
  summary text,
  achievements text[] default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text,
  tech_stack text[] default '{}',
  github_url text,
  live_url text,
  thumbnail_url text,
  featured boolean default false,
  created_at timestamptz not null default now()
);

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null,
  issue_date date not null,
  description text,
  credential_id text,
  credential_url text,
  skills text[] default '{}',
  image_url text,
  created_at timestamptz not null default now()
);

alter table public.skills enable row level security;
alter table public.experiences enable row level security;
alter table public.projects enable row level security;
alter table public.certificates enable row level security;

create policy "dev-mode anon access" on public.skills
  for all using (auth.role() = 'anon') with check (auth.role() = 'anon');

create policy "dev-mode anon access" on public.experiences
  for all using (auth.role() = 'anon') with check (auth.role() = 'anon');

create policy "dev-mode anon access" on public.projects
  for all using (auth.role() = 'anon') with check (auth.role() = 'anon');

create policy "dev-mode anon access" on public.certificates
  for all using (auth.role() = 'anon') with check (auth.role() = 'anon');
```

### Storage bucket for certificate images

1. In Supabase → Storage, create a new bucket named `certificates`.
2. Set it to **public** (or add a policy that allows `anon` `read` access if you prefer locking it down later).
3. The admin panel uploads images to this bucket and stores the resulting public URL in the `certificates.image_url` column.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/b9bc1f30-28c9-43b7-a40c-31e1dd7ce7eb) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
