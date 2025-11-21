import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import type { Certificate, Experience, Project, Skill } from "@/types/content";

type TableName = "skills" | "experiences" | "projects" | "certificates";

const skillSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  category: z.string().min(2, "Category is required."),
  proficiency: z.coerce.number().min(0).max(100),
  summary: z.string().optional(),
});

const experienceSchema = z.object({
  role: z.string().min(2, "Role is required."),
  company: z.string().min(2, "Company name is required."),
  start_date: z.string().min(2, "Start date is required."),
  end_date: z.string().optional(),
  summary: z.string().optional(),
  achievements: z.string().optional(),
});

const projectSchema = z.object({
  title: z.string().min(2, "Project title is required."),
  summary: z.string().min(8, "Summary should be at least 8 characters."),
  tech_stack: z.string().min(2, "Enter at least one technology."),
  github_url: z.string().url().optional().or(z.literal("")),
  live_url: z.string().url().optional().or(z.literal("")),
  thumbnail_url: z.string().url().optional().or(z.literal("")),
  featured: z.boolean().default(false),
});

const certificateSchema = z.object({
  title: z.string().min(2, "Certificate title is required."),
  issuer: z.string().min(2, "Issuer is required."),
  issue_date: z.string().min(2, "Issue date is required."),
  description: z.string().optional(),
  credential_id: z.string().optional(),
  credential_url: z.string().url().optional().or(z.literal("")),
  skills: z.string().optional(),
});

const useSupabaseCollection = <T,>({
  table,
  orderBy = "created_at",
  ascending = false,
}: {
  table: TableName;
  orderBy?: string;
  ascending?: boolean;
}): UseQueryResult<T[]> => {
  return useQuery({
    queryKey: [table],
    queryFn: async () => {
      const { data, error } = await supabase.from(table).select("*").order(orderBy, {
        ascending,
      });
      if (error) throw error;
      return data as T[];
    },
  });
};

const useTableMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const insertMutation = useMutation({
    mutationFn: async ({ table, payload }: { table: TableName; payload: Record<string, unknown> }) => {
      const { error } = await supabase.from(table).insert(payload);
      if (error) throw error;
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: [variables.table] });
      toast({
        title: "Saved successfully",
        description: "Your changes were pushed to Supabase.",
      });
    },
    onError: (error) => {
      toast({
        title: "Something went wrong",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ table, id }: { table: TableName; id: string }) => {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: [variables.table] });
      toast({
        title: "Entry removed",
        description: "The record has been deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Unable to delete",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return { insertMutation, deleteMutation };
};

const getUuid = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const Admin = () => {
  const skillsQuery = useSupabaseCollection<Skill>({ table: "skills" });
  const experiencesQuery = useSupabaseCollection<Experience>({
    table: "experiences",
    orderBy: "start_date",
    ascending: false,
  });
  const projectsQuery = useSupabaseCollection<Project>({ table: "projects" });
  const certificatesQuery = useSupabaseCollection<Certificate>({
    table: "certificates",
    orderBy: "issue_date",
    ascending: false,
  });
  const stats = useMemo(
    () => [
      { label: "Skills", value: skillsQuery.data?.length ?? 0 },
      { label: "Experiences", value: experiencesQuery.data?.length ?? 0 },
      { label: "Projects", value: projectsQuery.data?.length ?? 0 },
      { label: "Certificates", value: certificatesQuery.data?.length ?? 0 },
    ],
    [certificatesQuery.data, experiencesQuery.data, projectsQuery.data, skillsQuery.data],
  );

  return (
    <motion.div
      className="min-h-screen bg-background text-foreground"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 md:px-10">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-widest text-primary">Admin Console</p>
            <h1 className="text-3xl font-bold">Portfolio Content Manager</h1>
            <p className="text-muted-foreground">
              Add or edit skills, experience, and projects. All changes sync instantly with your Supabase
              tables.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" asChild>
              <Link to="/">← Back to portfolio</Link>
            </Button>
            <Button variant="secondary" onClick={() => window.location.reload()} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Hard refresh
            </Button>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-primary/20 bg-muted/30">
              <CardHeader className="pb-2">
                <CardDescription>{stat.label}</CardDescription>
                <CardTitle className="text-3xl">{stat.value}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Synced with Supabase</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <Tabs defaultValue="skills" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
          </TabsList>

          <TabsContent value="skills" className="space-y-6">
            <SkillManager skillsQuery={skillsQuery} />
          </TabsContent>

          <TabsContent value="experience" className="space-y-6">
            <ExperienceManager experiencesQuery={experiencesQuery} />
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <ProjectManager projectsQuery={projectsQuery} />
          </TabsContent>

          <TabsContent value="certificates" className="space-y-6">
            <CertificateManager certificatesQuery={certificatesQuery} />
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
};

const SkillManager = ({
  skillsQuery,
}: {
  skillsQuery: UseQueryResult<Skill[]>;
}) => {
  const { insertMutation, deleteMutation } = useTableMutations();
  const form = useForm<z.infer<typeof skillSchema>>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: "",
      category: "",
      proficiency: 80,
      summary: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof skillSchema>) => {
    insertMutation.mutate(
      {
        table: "skills",
        payload: values,
      },
      {
        onSuccess: () =>
          form.reset({
            name: "",
            category: "",
            proficiency: 80,
            summary: "",
          }),
      },
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Skills</span>
          <Badge variant="secondary">{skillsQuery.data?.length ?? 0} tracked</Badge>
        </CardTitle>
        <CardDescription>Capture the technologies you want to highlight.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <Form {...form}>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skill name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. TypeScript" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="Frontend, Backend, DevOps..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="proficiency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proficiency (%)</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} max={100} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Summary (optional)</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="Describe how you use this skill" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="md:col-span-2" disabled={insertMutation.isPending}>
              {insertMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add skill
                </>
              )}
            </Button>
          </form>
        </Form>

        <Separator />

        <ScrollArea className="h-72 rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Proficiency</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skillsQuery.isLoading && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                  </TableCell>
                </TableRow>
              )}
              {skillsQuery.data?.map((skill) => (
                <TableRow key={skill.id}>
                  <TableCell className="font-semibold">{skill.name}</TableCell>
                  <TableCell>{skill.category}</TableCell>
                  <TableCell>{skill.proficiency}%</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => deleteMutation.mutate({ table: "skills", id: skill.id })}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!skillsQuery.isLoading && skillsQuery.data?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No skills yet. Use the form above to add one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

const ExperienceManager = ({
  experiencesQuery,
}: {
  experiencesQuery: UseQueryResult<Experience[]>;
}) => {
  const { insertMutation, deleteMutation } = useTableMutations();
  const form = useForm<z.infer<typeof experienceSchema>>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      role: "",
      company: "",
      start_date: "",
      end_date: "",
      summary: "",
      achievements: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof experienceSchema>) => {
    const payload = {
      role: values.role,
      company: values.company,
      start_date: values.start_date,
      end_date: values.end_date || null,
      summary: values.summary ?? null,
      achievements:
        values.achievements
          ?.split("\n")
          .map((item) => item.trim())
          .filter(Boolean) ?? [],
    };

    insertMutation.mutate(
      {
        table: "experiences",
        payload,
      },
      {
        onSuccess: () =>
          form.reset({
            role: "",
            company: "",
            start_date: "",
            end_date: "",
            summary: "",
            achievements: "",
          }),
      },
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Experience</CardTitle>
        <CardDescription>Document your professional timeline.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <Form {...form}>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Input placeholder="Senior Frontend Engineer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input placeholder="Company name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="end_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Summary</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="Quick summary of your impact" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="achievements"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Key achievements (one per line)</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder={"• Shipped new dashboard\n• Improved performance"} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="md:col-span-2" disabled={insertMutation.isPending}>
              {insertMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add experience
                </>
              )}
            </Button>
          </form>
        </Form>

        <Separator />

        <div className="space-y-4">
          {experiencesQuery.isLoading && (
            <div className="flex justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}
          {experiencesQuery.data?.map((experience) => (
            <Card key={experience.id} className="border-muted">
              <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>{experience.role}</CardTitle>
                  <CardDescription>
                    {experience.company} • {experience.start_date} – {experience.end_date ?? "Present"}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteMutation.mutate({ table: "experiences", id: experience.id })}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {experience.summary && <p className="text-sm text-muted-foreground">{experience.summary}</p>}
                {experience.achievements && experience.achievements.length > 0 && (
                  <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    {experience.achievements.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))}
          {!experiencesQuery.isLoading && experiencesQuery.data?.length === 0 && (
            <p className="text-center text-sm text-muted-foreground">No experience entries yet.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const ProjectManager = ({
  projectsQuery,
}: {
  projectsQuery: UseQueryResult<Project[]>;
}) => {
  const { insertMutation, deleteMutation } = useTableMutations();
  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      summary: "",
      tech_stack: "",
      github_url: "",
      live_url: "",
      thumbnail_url: "",
      featured: false,
    },
  });

  const handleSubmit = (values: z.infer<typeof projectSchema>) => {
    const payload = {
      title: values.title,
      summary: values.summary,
      tech_stack: values.tech_stack.split(",").map((item) => item.trim()).filter(Boolean),
      github_url: values.github_url || null,
      live_url: values.live_url || null,
      thumbnail_url: values.thumbnail_url || null,
      featured: values.featured,
    };

    insertMutation.mutate(
      {
        table: "projects",
        payload,
      },
      {
        onSuccess: () =>
          form.reset({
            title: "",
            summary: "",
            tech_stack: "",
            github_url: "",
            live_url: "",
            thumbnail_url: "",
            featured: false,
          }),
      },
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects</CardTitle>
        <CardDescription>Showcase the work you want people to see first.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <Form {...form}>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Project title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Neon Portfolio" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Summary</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="What problem does it solve?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tech_stack"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Tech stack (comma separated)</FormLabel>
                  <FormControl>
                    <Input placeholder="React, Supabase, Tailwind" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="github_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://github.com/username/project" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="live_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Live URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://project.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="thumbnail_url"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Thumbnail image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://images.com/project.png" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-md border p-4 md:col-span-2">
                  <div className="space-y-0.5">
                    <FormLabel>Featured project</FormLabel>
                    <p className="text-sm text-muted-foreground">Pin this project to the top of your list.</p>
                  </div>
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(checked === true)} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" className="md:col-span-2" disabled={insertMutation.isPending}>
              {insertMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add project
                </>
              )}
            </Button>
          </form>
        </Form>

        <Separator />

        <ScrollArea className="h-72 rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Tech stack</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projectsQuery.isLoading && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                  </TableCell>
                </TableRow>
              )}
              {projectsQuery.data?.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-semibold">{project.title}</TableCell>
                  <TableCell className="space-x-1">
                    {project.tech_stack?.map((tech) => (
                      <Badge key={tech}>{tech}</Badge>
                    ))}
                  </TableCell>
                  <TableCell>
                    {project.featured ? (
                      <Badge variant="secondary">Featured</Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">Standard</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => deleteMutation.mutate({ table: "projects", id: project.id })}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!projectsQuery.isLoading && projectsQuery.data?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No projects yet. Use the form above to create one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

const CertificateManager = ({
  certificatesQuery,
}: {
  certificatesQuery: UseQueryResult<Certificate[]>;
}) => {
  const { insertMutation, deleteMutation } = useTableMutations();
  const { toast } = useToast();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const form = useForm<z.infer<typeof certificateSchema>>({
    resolver: zodResolver(certificateSchema),
    defaultValues: {
      title: "",
      issuer: "",
      issue_date: "",
      description: "",
      credential_id: "",
      credential_url: "",
      skills: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof certificateSchema>) => {
    setUploading(true);
    try {
      let imageUrl: string | null = null;
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const filePath = `certificates/${getUuid()}.${fileExt ?? "png"}`;
        const { data: storageData, error: uploadError } = await supabase.storage
          .from("certificates")
          .upload(filePath, imageFile, {
            upsert: true,
            cacheControl: "3600",
            contentType: imageFile.type,
          });
        if (uploadError) {
          throw new Error(uploadError.message);
        }
        const { data } = supabase.storage.from("certificates").getPublicUrl(filePath);
        imageUrl = data.publicUrl;
      }

      await insertMutation.mutateAsync({
        table: "certificates",
        payload: {
          ...values,
          description: values.description || null,
          credential_id: values.credential_id || null,
          credential_url: values.credential_url || null,
          image_url: imageUrl,
          skills:
            values.skills
              ?.split(",")
              .map((tag) => tag.trim())
              .filter(Boolean) ?? [],
        },
      });

      form.reset({
        title: "",
        issuer: "",
        issue_date: "",
        description: "",
        credential_id: "",
        credential_url: "",
        skills: "",
      });
      setImageFile(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Please verify the Supabase storage bucket exists.";
      toast({
        title: "Upload failed",
        description: message,
        variant: "destructive",
      });
      console.error("[Certificates] Upload failed", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Certificates</CardTitle>
        <CardDescription>Keep proof of expertise organized and shareable.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <Form {...form}>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Certificate name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. AWS Certified Cloud Practitioner" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="issuer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issuer</FormLabel>
                  <FormControl>
                    <Input placeholder="Amazon Web Services" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="issue_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issue date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="credential_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Credential ID</FormLabel>
                  <FormControl>
                    <Input placeholder="ABC-123456" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="credential_url"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Credential URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://verify.example.com/cert/123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Key skills (comma separated)</FormLabel>
                  <FormControl>
                    <Input placeholder="Cloud, Security, Architecture" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="md:col-span-2 space-y-2">
              <FormLabel>Certificate image</FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
              />
              <p className="text-xs text-muted-foreground">
                Upload a JPG/PNG proof. Files go to the `certificates` storage bucket.
              </p>
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="What does this certification cover?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="md:col-span-2"
              disabled={insertMutation.isPending || uploading}
            >
              {insertMutation.isPending || uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add certificate
                </>
              )}
            </Button>
          </form>
        </Form>

        <Separator />

        <ScrollArea className="h-72 rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Issuer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {certificatesQuery.isLoading && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                  </TableCell>
                </TableRow>
              )}
              {certificatesQuery.data?.map((certificate) => (
                <TableRow key={certificate.id}>
                  <TableCell className="font-semibold">{certificate.title}</TableCell>
                  <TableCell>{certificate.issuer}</TableCell>
                  <TableCell>{certificate.issue_date}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => deleteMutation.mutate({ table: "certificates", id: certificate.id })}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!certificatesQuery.isLoading && certificatesQuery.data?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No certificates yet. Use the form above to add one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default Admin;

