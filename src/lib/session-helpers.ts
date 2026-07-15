import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Returns the current session's user id, but only if that user still
 * genuinely exists in the database. Protects against stale JWT session
 * cookies left over from a database reset (a valid signed cookie whose
 * referenced user row no longer exists) causing foreign key crashes.
 */
export async function getValidUserId(): Promise<string | null> {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) return null;
  const user = await prisma.user.findUnique({ where: { id }, select: { id: true } });
  return user ? id : null;
}
