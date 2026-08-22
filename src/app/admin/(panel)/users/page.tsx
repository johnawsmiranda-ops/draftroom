import { listUsers } from "@/lib/actions/admin";
import { AdminUserTable } from "@/components/admin/AdminUserTable";
import { CreateUserForm } from "@/components/admin/CreateUserForm";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page } = await searchParams;
  const users = await listUsers({ query: q, page: Number(page) || 1 });

  if (!users) {
    return <p className="px-6 py-12 text-ink-soft">Unable to load users.</p>;
  }

  return (
    <main className="px-5 sm:px-8 py-8 max-w-6xl">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl">Users</h1>
          <p className="text-ink-soft text-sm mt-1">Create accounts and manage who has access.</p>
        </div>
        <CreateUserForm />
      </div>

      <AdminUserTable
        rows={users.rows}
        total={users.total}
        page={users.page}
        pages={users.pages}
        query={q ?? ""}
        basePath="/admin/users"
      />
    </main>
  );
}
