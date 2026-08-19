import { requireUser } from "@/lib/current-user";
import { Sidebar } from "@/components/Sidebar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <div className="flex flex-1 bg-paper">
      <Sidebar userName={user.name} />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
