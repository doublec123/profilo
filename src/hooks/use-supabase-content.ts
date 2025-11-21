import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";
import type { Certificate, Experience, Project, Skill } from "@/types/content";

export const useSkills = () =>
  useQuery({
    queryKey: ["skills", "public"],
    queryFn: async (): Promise<Skill[]> => {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("proficiency", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

export const useExperiences = () =>
  useQuery({
    queryKey: ["experiences", "public"],
    queryFn: async (): Promise<Experience[]> => {
      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .order("start_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

export const useProjects = () =>
  useQuery({
    queryKey: ["projects", "public"],
    queryFn: async (): Promise<Project[]> => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

export const useCertificates = () =>
  useQuery({
    queryKey: ["certificates", "public"],
    queryFn: async (): Promise<Certificate[]> => {
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .order("issue_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

