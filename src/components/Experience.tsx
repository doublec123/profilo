import { Briefcase, Calendar, Loader2 } from "lucide-react";
import { useMemo } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useExperiences } from "@/hooks/use-supabase-content";
import AnimatedSection from "./AnimatedSection";

const formatDate = (date: string | null) => {
  if (!date) return "Present";
  return new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(new Date(date));
};

const Experience = () => {
  const { data, isLoading, isError } = useExperiences();

  const experiences = useMemo(() => data ?? [], [data]);

  return (
    <AnimatedSection id="experience" className="py-24 px-6 relative">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">
          <span className="gradient-text">Experience</span>
        </h2>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <p className="text-center text-muted-foreground">Unable to load experience data.</p>
        ) : experiences.length ? (
          <div className="space-y-6">
            {experiences.map((experience) => (
              <Card key={experience.id} className="border-primary/10 bg-muted/20">
                <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-primary" />
                      {experience.role}
                    </CardTitle>
                    <CardDescription>{experience.company}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {formatDate(experience.start_date)} – {formatDate(experience.end_date)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {experience.summary && <p className="text-muted-foreground">{experience.summary}</p>}
                  {experience.achievements && experience.achievements.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm uppercase tracking-wide text-primary/80">Highlights</p>
                      <div className="flex flex-wrap gap-2">
                        {experience.achievements.map((achievement) => (
                          <Badge key={achievement} variant="outline" className="border-primary/30">
                            {achievement}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            No experience entries yet. Add them via the admin panel to display your timeline.
          </p>
        )}
      </div>
    </AnimatedSection>
  );
};

export default Experience;

