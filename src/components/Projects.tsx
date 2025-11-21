import { ExternalLink, Github, Loader2 } from "lucide-react";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { useProjects } from "@/hooks/use-supabase-content";
import AnimatedSection from "./AnimatedSection";

const colorCycle = ["primary", "secondary", "accent"] as const;

const Projects = () => {
  const { data, isLoading, isError } = useProjects();

  const projects = useMemo(() => {
    if (!data) return [];
    return [...data].sort((a, b) => {
      const featuredDiff = Number(b.featured ?? false) - Number(a.featured ?? false);
      if (featuredDiff !== 0) return featuredDiff;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [data]);

  return (
    <AnimatedSection id="projects" className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">
          <span className="gradient-text">Featured Projects</span>
        </h2>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <p className="text-center text-muted-foreground">Unable to load projects right now.</p>
        ) : projects.length ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => {
              const palette = colorCycle[index % colorCycle.length];
              const badgeClass = {
                primary: "bg-primary/10 border border-primary/30 text-primary",
                secondary: "bg-secondary/10 border border-secondary/30 text-secondary",
                accent: "bg-accent/10 border border-accent/30 text-accent",
              }[palette];

              return (
                <div
                  key={project.id}
                  className="glass-card p-6 group hover:scale-105 transition-all duration-300 hover:neon-glow-primary"
                >
                  <div className="mb-4">
                    <h3 className="text-2xl font-semibold mb-3 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{project.summary}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {(project.tech_stack ?? []).map((tag) => (
                      <span key={tag} className={`px-3 py-1 text-xs rounded-full ${badgeClass}`}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="project-link"
                      size="sm"
                      className="flex-1"
                      disabled={!project.live_url}
                      asChild={Boolean(project.live_url)}
                    >
                      {project.live_url ? (
                        <a href={project.live_url} target="_blank" rel="noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Demo
                        </a>
                      ) : (
                        <>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Live soon
                        </>
                      )}
                    </Button>
                    <Button
                      variant="project-link"
                      size="sm"
                      className="flex-1"
                      disabled={!project.github_url}
                      asChild={Boolean(project.github_url)}
                    >
                      {project.github_url ? (
                        <a href={project.github_url} target="_blank" rel="noreferrer">
                          <Github className="mr-2 h-4 w-4" />
                          Code
                        </a>
                      ) : (
                        <>
                          <Github className="mr-2 h-4 w-4" />
                          Private
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            No projects yet. Add them in the admin dashboard to showcase your work.
          </p>
        )}
      </div>
    </AnimatedSection>
  );
};

export default Projects;
