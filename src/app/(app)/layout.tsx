import { requireUser } from "@/lib/current-user";
import { listProjects } from "@/lib/actions/projects";
import { AppShell } from "@/components/AppShell";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const projects = await listProjects();

  return (
    <AppShell userName={user.name} projects={projects.map((p) => ({ id: p.id, title: p.title }))}>
      {children}
    </AppShell>
  );
}
