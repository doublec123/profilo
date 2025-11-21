import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, ShieldAlert } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const SESSION_KEY = "admin-iw-session";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const AdminCredentialsGate = ({ children }: { children: React.ReactNode }) => {
  const { toast } = useToast();

  const adminUsername = import.meta.env.VITE_ADMIN_USERNAME;
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

  const [authenticated, setAuthenticated] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.sessionStorage.getItem(SESSION_KEY) === "true";
  });

  if (!adminUsername || !adminPassword) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="max-w-md w-full border-destructive/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <ShieldAlert className="h-5 w-5" />
              Missing admin credentials
            </CardTitle>
            <CardDescription>
              Define `VITE_ADMIN_USERNAME` and `VITE_ADMIN_PASSWORD` in your `.env` file, then restart
              the dev server.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    if (values.username === adminUsername && values.password === adminPassword) {
      window.sessionStorage.setItem(SESSION_KEY, "true");
      setAuthenticated(true);
      toast({
        title: "Welcome back",
        description: "Admin dashboard unlocked.",
      });
    } else {
      toast({
        title: "Invalid credentials",
        description: "Please double-check the username and password.",
        variant: "destructive",
      });
    }
  };

  if (authenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="max-w-md w-full border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            Admin-iw access
          </CardTitle>
          <CardDescription>Enter the credentials defined in your environment file.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input autoComplete="username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" autoComplete="current-password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Enter admin-iw
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCredentialsGate;

