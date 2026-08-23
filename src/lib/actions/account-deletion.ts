"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/current-user";
import { revalidatePath } from "next/cache";

export async function getPendingDeletionRequest() {
  const user = await requireUser();
  return prisma.accountDeletionRequest.findFirst({
    where: { userId: user.id, status: "pending" },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Files a "please delete my account" request. This intentionally does NOT
 * delete anything itself -- there's no email/notification pipeline wired up
 * yet (see the note on the SupportMessage flow), so a request just sits in
 * the table with status "pending" until an admin notices and processes it
 * by hand. Refuses a second request while one is already pending so the
 * table doesn't fill up with duplicates from someone clicking twice.
 */
export async function requestAccountDeletionAction() {
  const user = await requireUser();

  const existing = await prisma.accountDeletionRequest.findFirst({
    where: { userId: user.id, status: "pending" },
  });
  if (existing) return { ok: true, alreadyPending: true };

  // session.user.email is typed nullable by NextAuth even though the User
  // row itself always has one -- look the real value up rather than trust
  // the session type.
  const dbUser = await prisma.user.findUniqueOrThrow({
    where: { id: user.id },
    select: { email: true },
  });

  await prisma.accountDeletionRequest.create({
    data: { userId: user.id, email: dbUser.email },
  });

  revalidatePath("/profile");
  return { ok: true, alreadyPending: false };
}
