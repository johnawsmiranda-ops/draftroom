import { getAdminStats, getSignupSeries, listUsers } from "@/lib/actions/admin";
import { AdminUserTable } from "@/components/admin/AdminUserTable";
import { UserGrowthChart } from "@/components/admin/UserGrowthChart";
import { CreateUserForm } from "@/components/admin/CreateUserForm";

function StatTile({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-line bg-card p-4">
      <p className="text-xs text-ink-soft mb-1.5">{label}</p>
      <p className="font-display text-2xl leading-none">{value}</p>
      {sub && <p className="text-[11px] text-ink-soft mt-1.5">{sub}</p>}
    </div>
  );
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page } = await searchParams;

  const [stats, users, series] = await Promise.all([
    getAdminStats(),
    listUsers({ query: q, page: Number(page) || 1 }),
    getSignupSeries(),
  ]);

  if (!stats || !users || !series) {
    return <p className="px-4 sm:px-8 py-12 text-ink-soft">Unable to load admin data.</p>;
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-8 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl">Users</h1>
          <p className="text-ink-soft text-sm mt-1">Create accounts and manage who has access.</p>
        </div>
        <CreateUserForm />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
        <StatTile
          label="Total"
          value={stats.totalUsers.toLocaleString()}
          sub={`${stats.newUsersThisMonth} new this month`}
        />
        <StatTile label="Active" value={stats.activeUsers.toLocaleString()} />
        <StatTile
          label="Disabled"
          value={stats.disabledUsers.toLocaleString()}
          sub={stats.disabledUsers > 0 ? "can't sign in" : undefined}
        />
        <StatTile label="Premium" value={stats.premiumUsers.toLocaleString()} sub="set manually" />
        <StatTile label="Admins" value={stats.adminUsers.toLocaleString()} />
      </div>

      <div className="rounded-2xl border border-line bg-card p-5 mb-8">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-display text-lg">Signups</h2>
          <span className="text-xs text-ink-soft">Last 30 days, cumulative</span>
        </div>
        <UserGrowthChart data={series} />
      </div>

      <AdminUserTable
        rows={users.rows}
        total={users.total}
        page={users.page}
        pages={users.pages}
        query={q ?? ""}
      />
    </main>
  );
}
