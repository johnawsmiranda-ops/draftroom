import { requireUser } from "@/lib/current-user";
import { listProjects } from "@/lib/actions/projects";
import { getCurrentUserProfile } from "@/lib/actions/profile";
import { AppShell } from "@/components/AppShell";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const [projects, profile] = await Promise.all([listProjects(), getCurrentUserProfile()]);

  return (
    <AppShell
      userName={profile?.name ?? user.name}
      avatarUrl={profile?.avatarUrl}
      projects={projects.map((p) => ({ id: p.id, title: p.title }))}
    >
      {children}
    </AppShell>
  );
}
