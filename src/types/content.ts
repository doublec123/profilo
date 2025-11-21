export type Skill = {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  summary?: string | null;
  created_at: string;
};

export type Experience = {
  id: string;
  role: string;
  company: string;
  start_date: string;
  end_date: string | null;
  summary: string | null;
  achievements: string[] | null;
  created_at: string;
};

export type Project = {
  id: string;
  title: string;
  summary: string | null;
  tech_stack: string[] | null;
  github_url: string | null;
  live_url: string | null;
  thumbnail_url: string | null;
  featured: boolean | null;
  created_at: string;
};

export type Certificate = {
  id: string;
  title: string;
  issuer: string;
  issue_date: string;
  description: string | null;
  credential_id: string | null;
  credential_url: string | null;
  skills: string[] | null;
  image_url: string | null;
  created_at: string;
};

