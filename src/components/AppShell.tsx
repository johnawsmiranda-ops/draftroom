"use client";

import { ViewModeProvider, useViewMode } from "@/lib/view-mode";
import { Sidebar } from "@/components/Sidebar";
import { MobileShell } from "@/components/MobileShell";
import { DraftsmanAssistant } from "@/components/DraftsmanAssistant";
import { SandboxImportBridge } from "@/components/SandboxImportBridge";

type Project = { id: string; title: string };

function ShellSwitcher({
  userName,
  avatarUrl,
  projects,
  isAdmin,
  children,
}: {
  userName?: string | null;
  avatarUrl?: string | null;
  projects: Project[];
  isAdmin?: boolean;
  children: React.ReactNode;
}) {
  const { mode } = useViewMode();

  if (mode === "mobile") {
    return (
      <MobileShell userName={userName} avatarUrl={avatarUrl} projects={projects}>
        {children}
      </MobileShell>
    );
  }

  return (
    <div className="flex flex-1 bg-paper">
      <Sidebar userName={userName} avatarUrl={avatarUrl} projects={projects} isAdmin={isAdmin} />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

export function AppShell({
  userName,
  avatarUrl,
  projects,
  isAdmin,
  children,
}: {
  userName?: string | null;
  avatarUrl?: string | null;
  projects: Project[];
  isAdmin?: boolean;
  children: React.ReactNode;
}) {
  return (
    <ViewModeProvider>
      <ShellSwitcher
        userName={userName}
        avatarUrl={avatarUrl}
        projects={projects}
        isAdmin={isAdmin}
      >
        {children}
      </ShellSwitcher>
      <DraftsmanAssistant userName={userName} />
      <SandboxImportBridge />
    </ViewModeProvider>
  );
}
