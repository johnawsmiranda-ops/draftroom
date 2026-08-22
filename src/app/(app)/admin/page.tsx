import { requireAdmin } from "@/lib/admin";
import { getAdminStats, getSignupSeries, listUsers } from "@/lib/actions/admin";
import { AdminUserTable } from "@/components/admin/AdminUserTable";
import { UserGrowthChart } from "@/components/admin/UserGrowthChart";

function StatTile({
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
      <p className="text-xs text-ink-soft mb-1.5">{label}</p>
      <p className="font-display text-3xl leading-none">{value}</p>
      {sub && <p className="text-[11px] text-ink-soft mt-2">{sub}</p>}
    </div>
  );
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const admin = await requireAdmin();
  const { q, page } = await searchParams;

  const [stats, users, series] = await Promise.all([
    getAdminStats(),
    listUsers({ query: q, page: Number(page) || 1 }),
    getSignupSeries(),
  ]);

  if (!stats || !users || !series) {
    return <p className="px-4 sm:px-10 py-12 text-ink-soft">Unable to load admin data.</p>;
  }

  return (
    <main className="px-4 sm:px-10 py-10 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl">Admin</h1>
        <p className="text-ink-soft text-sm mt-1">
          Signed in as {admin.name ?? admin.email}. Account management only — no one&apos;s writing is
          readable from here.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatTile
          label="Total users"
          value={stats.totalUsers.toLocaleString()}
          sub={`${stats.newUsersThisMonth} new this month`}
          tint="bg-sticky-sage/30"
        />
        <StatTile
          label="Active accounts"
          value={stats.activeUsers.toLocaleString()}
          sub={`${stats.totalUsers - stats.activeUsers} disabled`}
          tint="bg-sticky-cream"
        />
        <StatTile
          label="Premium"
          value={stats.premiumUsers.toLocaleString()}
          sub="Set manually — billing not wired up"
          tint="bg-sticky-peach/40"
        />
        <StatTile
          label="Words written"
          value={stats.totalWords.toLocaleString()}
          sub={`across ${stats.totalDocuments.toLocaleString()} documents`}
          tint="bg-sticky-lav/40"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <div className="lg:col-span-2 rounded-2xl border border-line bg-card p-5">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-display text-lg">User growth</h2>
            <span className="text-xs text-ink-soft">Last 30 days, cumulative</span>
          </div>
          <UserGrowthChart data={series} />
        </div>

        <div className="rounded-2xl border border-line bg-card p-5">
          <h2 className="font-display text-lg mb-4">Content</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-ink-soft">Projects</dt>
              <dd className="font-display text-lg">{stats.totalProjects.toLocaleString()}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-line pt-3">
              <dt className="text-ink-soft">Documents</dt>
              <dd className="font-display text-lg">{stats.totalDocuments.toLocaleString()}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-line pt-3">
              <dt className="text-ink-soft">Glimpses</dt>
              <dd className="font-display text-lg">{stats.totalGlimpses.toLocaleString()}</dd>
            </div>
          </dl>
          <p className="text-[11px] text-ink-soft mt-5 leading-relaxed">
            Counts only. Opening anyone&apos;s writing isn&apos;t possible from the admin panel by
            design.
          </p>
        </div>
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
