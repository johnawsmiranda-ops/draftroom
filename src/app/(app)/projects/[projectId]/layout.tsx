import Link from "next/link";
import { getProject } from "@/lib/actions/projects";
import { ProjectTabs } from "@/components/ProjectTabs";
import { ProjectMenu } from "@/components/ProjectMenu";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getProject(projectId);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 sm:px-10 pt-10 pb-4 flex items-center justify-between">
        <div>
          <Link href="/home" className="text-xs text-ink-soft hover:text-ink">
            ← All projects
          </Link>
          <h1 className="font-display text-3xl mt-2">{project.title}</h1>
        </div>
        <ProjectMenu projectId={projectId} title={project.title} />
      </header>
      <ProjectTabs projectId={projectId} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
