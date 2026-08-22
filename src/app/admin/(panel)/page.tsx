import Link from "next/link";
import { getAdminStats, getSignupSeries, listUsers } from "@/lib/actions/admin";
import { AdminUserTable } from "@/components/admin/AdminUserTable";
import { UserGrowthChart } from "@/components/admin/UserGrowthChart";
import { CreateUserForm } from "@/components/admin/CreateUserForm";

function StatCard({
  label,
  value,
  sub,
  tint,
}: {
  label: string;
  value: string;
  sub?: string;
  tint: string;
}) {
  return (
    <div className={`rounded-2xl border border-line p-5 ${tint}`}>
      <p className="text-xs text-ink-soft mb-2">{label}</p>
      <p className="font-display text-3xl leading-none">{value}</p>
      {sub && <p className="text-[11px] text-ink-soft mt-2.5">{sub}</p>}
    </div>
  );
}

export default async function AdminDashboard() {
  const [stats, users, series] = await Promise.all([
    getAdminStats(),
    listUsers({ page: 1 }),
    getSignupSeries(),
  ]);

  if (!stats || !users || !series) {
    return <p className="px-6 py-12 text-ink-soft">Unable to load admin data.</p>;
  }

  return (
    <main className="px-5 sm:px-8 py-8 max-w-6xl">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl">Dashboard</h1>
          <p className="text-ink-soft text-sm mt-1">Accounts and access across Draftroom.</p>
        </div>
        <CreateUserForm />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total users"
          value={stats.totalUsers.toLocaleString()}
          sub={`${stats.newUsersThisMonth} new this month`}
          tint="bg-sticky-sage/30"
        />
        <StatCard
          label="Active"
          value={stats.activeUsers.toLocaleString()}
          sub={stats.disabledUsers > 0 ? `${stats.disabledUsers} disabled` : "none disabled"}
          tint="bg-sticky-cream"
        />
        <StatCard
          label="Premium"
          value={stats.premiumUsers.toLocaleString()}
          sub="set manually — no billing yet"
          tint="bg-sticky-peach/40"
        />
        <StatCard
          label="Admins"
          value={stats.adminUsers.toLocaleString()}
          sub="can reach this panel"
          tint="bg-sticky-lav/40"
        />
      </div>

      <div className="rounded-2xl border border-line bg-card p-5 mb-6">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-display text-lg">User growth</h2>
          <span className="text-xs text-ink-soft">Last 30 days, cumulative</span>
        </div>
        <UserGrowthChart data={series} />
      </div>

      <AdminUserTable
        rows={users.rows}
        total={users.total}
        page={users.page}
        pages={users.pages}
        query=""
        basePath="/admin/users"
      />

      <div className="mt-4">
        <Link href="/admin/users" className="text-xs text-ink-soft hover:text-ink underline">
          Manage all users →
        </Link>
      </div>
    </main>
  );
}
