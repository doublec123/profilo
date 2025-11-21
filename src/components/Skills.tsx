import { Loader2 } from "lucide-react";
import { useMemo } from "react";

import { useSkills } from "@/hooks/use-supabase-content";
import AnimatedSection from "./AnimatedSection";

const categoryCopy: Record<
  string,
  { title: string; tone: "primary" | "secondary" | "accent" }
> = {
  frontend: { title: "Frontend Development", tone: "primary" },
  backend: { title: "Backend & Python", tone: "secondary" },
  security: { title: "Ethical Hacking", tone: "accent" },
  automation: { title: "AI Automation", tone: "primary" },
  design: { title: "UI/UX Design", tone: "secondary" },
};

const orderedCategories = Object.keys(categoryCopy);

const toneStyles = {
  primary: {
    heading: "text-primary",
    pill: "bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20",
  },
  secondary: {
    heading: "text-secondary",
    pill: "bg-secondary/10 border border-secondary/30 text-secondary hover:bg-secondary/20",
  },
  accent: {
    heading: "text-accent",
    pill: "bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20",
  },
};

const Skills = () => {
  const { data, isLoading, isError } = useSkills();

  const groupedSkills = useMemo(() => {
    const map = new Map<string, string[]>();
    data?.forEach((skill) => {
      const key = skill.category.toLowerCase();
      const existing = map.get(key) ?? [];
      existing.push(skill.name);
      map.set(key, existing);
    });
    return map;
  }, [data]);

  const categories = useMemo(() => {
    const known = orderedCategories.filter((key) => groupedSkills.get(key)?.length);
    const dynamic = Array.from(groupedSkills.keys()).filter((key) => !orderedCategories.includes(key));
    return [...known, ...dynamic];
  }, [groupedSkills]);

  return (
    <AnimatedSection id="skills" className="py-24 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">
          <span className="gradient-text">Skills & Expertise</span>
        </h2>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <p className="text-center text-muted-foreground">Unable to load skills right now.</p>
        ) : categories.length ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => {
              const skillsForCategory = groupedSkills.get(category) ?? [];
              const tone = categoryCopy[category]?.tone ?? "primary";
              const title = categoryCopy[category]?.title ?? category;
              return (
                <div
                  key={category}
                  className="glass-card p-8 hover:scale-105 transition-transform duration-300"
                >
                  <h3 className={`text-2xl font-semibold mb-6 ${toneStyles[tone].heading}`}>{title}</h3>
                  <div className="flex flex-wrap gap-2">
                    {skillsForCategory.map((skill) => (
                      <span
                        key={skill}
                        className={`px-3 py-1 text-sm rounded-full transition-colors ${toneStyles[tone].pill}`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            No skills added yet. Use the admin panel to create your first entries.
          </p>
        )}
      </div>
    </AnimatedSection>
  );
};

export default Skills;
