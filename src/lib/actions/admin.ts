"use server";

import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin";
import { revalidatePath } from "next/cache";

const PAGE_SIZE = 10;

export type AdminStats = {
  totalUsers: number;
  activeUsers: number;
  premiumUsers: number;
  totalProjects: number;
  totalDocuments: number;
  totalGlimpses: number;
  totalWords: number;
  newUsersThisMonth: number;
};

export async function getAdminStats(): Promise<AdminStats | null> {
  if (!(await getAdminUser())) return null;

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    totalUsers,
    activeUsers,
    premiumUsers,
    totalProjects,
    totalDocuments,
    totalGlimpses,
    wordAgg,
    newUsersThisMonth,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { status: "active" } }),
    prisma.user.count({ where: { plan: "premium" } }),
    prisma.project.count(),
    prisma.document.count(),
    prisma.glimpse.count(),
    prisma.chapter.aggregate({ _sum: { wordCount: true } }),
    prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
  ]);

  return {
    totalUsers,
    activeUsers,
    premiumUsers,
    totalProjects,
    totalDocuments,
    totalGlimpses,
    totalWords: wordAgg._sum.wordCount ?? 0,
    newUsersThisMonth,
  };
}

export type AdminUserRow = {
  id: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
  role: string;
  status: string;
  plan: string;
  createdAt: Date;
  projectCount: number;
  glimpseCount: number;
};

export async function listUsers(opts: { query?: string; page?: number } = {}) {
  if (!(await getAdminUser())) return null;

  const page = Math.max(1, opts.page ?? 1);
  const query = (opts.query ?? "").trim();

  const where = query
    ? {
        OR: [
          { email: { contains: query, mode: "insensitive" as const } },
          { name: { contains: query, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        role: true,
        status: true,
        plan: true,
        createdAt: true,
        _count: { select: { projects: true, glimpses: true } },
      },
    }),
  ]);

  const rows: AdminUserRow[] = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    avatarUrl: u.avatarUrl,
    role: u.role,
    status: u.status,
    plan: u.plan,
    createdAt: u.createdAt,
    projectCount: u._count.projects,
    glimpseCount: u._count.glimpses,
  }));

  return { rows, total, page, pageSize: PAGE_SIZE, pages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

/** Signups per day for the last 30 days, oldest first — feeds the growth chart. */
export async function getSignupSeries() {
  if (!(await getAdminUser())) return null;

  const since = new Date();
  since.setDate(since.getDate() - 29);
  since.setHours(0, 0, 0, 0);

  const users = await prisma.user.findMany({
    where: { createdAt: { gte: since } },
    select: { createdAt: true },
  });

  const byDay = new Map<string, number>();
  for (let i = 0; i < 30; i++) {
    const d = new Date(since);
    d.setDate(since.getDate() + i);
    byDay.set(d.toISOString().slice(0, 10), 0);
  }
  for (const u of users) {
    const key = new Date(u.createdAt).toISOString().slice(0, 10);
    if (byDay.has(key)) byDay.set(key, (byDay.get(key) ?? 0) + 1);
  }

  // Cumulative total is more meaningful than daily spikes on a young product,
  // so we carry a running total forward from the pre-window user count.
  const priorTotal = await prisma.user.count({ where: { createdAt: { lt: since } } });
  let running = priorTotal;
  return Array.from(byDay.entries()).map(([date, count]) => {
    running += count;
    return { date, signups: count, total: running };
  });
}

async function guard() {
  const admin = await getAdminUser();
  if (!admin) throw new Error("Not authorized");
  return admin;
}

export async function setUserStatusAction(userId: string, status: "active" | "disabled") {
  const admin = await guard();
  // Never let an admin lock themselves out of their own panel.
  if (admin.id === userId && status === "disabled") {
    return { ok: false, error: "You can't disable your own account." };
  }
  await prisma.user.update({ where: { id: userId }, data: { status } });
  revalidatePath("/admin");
  return { ok: true };
}

export async function setUserPlanAction(userId: string, plan: "free" | "premium") {
  await guard();
  await prisma.user.update({ where: { id: userId }, data: { plan } });
  revalidatePath("/admin");
  return { ok: true };
}

export async function setUserRoleAction(userId: string, role: "user" | "admin") {
  const admin = await guard();
  if (admin.id === userId && role === "user") {
    return { ok: false, error: "You can't remove your own admin access." };
  }
  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin");
  return { ok: true };
}

export async function deleteUserAction(userId: string) {
  const admin = await guard();
  if (admin.id === userId) {
    return { ok: false, error: "You can't delete your own account from here." };
  }
  // Cascades through projects, glimpses, documents, writing dates & sessions.
  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin");
  return { ok: true };
}
