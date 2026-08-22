import { requireAdmin } from "@/lib/admin";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

/**
 * The admin panel lives outside the (app) route group on purpose: no writer
 * sidebar, no project list, no view-mode toggle. The sign-in page sits in a
 * sibling folder so it isn't caught by this guard (which would loop).
 */
export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  return (
    <div className="flex min-h-screen bg-paper">
      <AdminSidebar
        name={admin.name}
        email={admin.email}
        avatarUrl={admin.avatarUrl}
        role={admin.role}
      />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
