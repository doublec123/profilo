import { Award, ExternalLink, Loader2 } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCertificates } from "@/hooks/use-supabase-content";
import AnimatedSection from "./AnimatedSection";

const Certificates = () => {
  const { data, isLoading, isError } = useCertificates();

  return (
    <AnimatedSection id="certificates" className="py-24 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">
          <span className="gradient-text">Certificates</span>
        </h2>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <p className="text-center text-muted-foreground">Unable to load certificates.</p>
        ) : data && data.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {data.map((certificate) => {
              const formattedDate = new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(
                new Date(certificate.issue_date),
              );

              return (
                <Dialog key={certificate.id}>
                  <DialogTrigger asChild>
                    <Card className="cursor-pointer border-primary/10 bg-muted/20 hover:neon-glow-primary transition">
                      {certificate.image_url && (
                        <div className="h-48 w-full overflow-hidden rounded-t-xl border-b border-primary/10 bg-black/40">
                          <img
                            src={certificate.image_url}
                            alt={certificate.title}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <Award className="h-6 w-6 text-primary" />
                          {certificate.title}
                        </CardTitle>
                        <CardDescription>
                          {certificate.issuer} • {formattedDate}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {certificate.description && (
                          <p className="text-sm text-muted-foreground line-clamp-3">{certificate.description}</p>
                        )}
                        {certificate.skills && certificate.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {certificate.skills.map((skill) => (
                              <Badge key={skill} variant="outline" className="border-primary/30">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{certificate.title}</DialogTitle>
                      <DialogDescription>
                        {certificate.issuer} • {formattedDate}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      {certificate.image_url && (
                        <div className="overflow-hidden rounded-lg border border-border">
                          <img
                            src={certificate.image_url}
                            alt={certificate.title}
                            className="w-full object-contain"
                            loading="lazy"
                          />
                        </div>
                      )}
                      {certificate.description && (
                        <p className="text-sm text-muted-foreground">{certificate.description}</p>
                      )}
                      {certificate.skills && certificate.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {certificate.skills.map((skill) => (
                            <Badge key={skill} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-3">
                        {certificate.credential_id && (
                          <Badge variant="outline" className="border-primary/40">
                            ID: {certificate.credential_id}
                          </Badge>
                        )}
                        {certificate.credential_url && (
                          <Button asChild variant="secondary">
                            <a href={certificate.credential_url} target="_blank" rel="noreferrer">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Verify credential
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            No certificates yet. Add them in the admin dashboard to showcase your achievements.
          </p>
        )}
      </div>
    </AnimatedSection>
  );
};

export default Certificates;

