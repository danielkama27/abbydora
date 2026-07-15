import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type SessionCheck =
  | { status: "authenticated"; userId: string }
  | { status: "unauthenticated" } // never logged in — completely normal, not an error
  | { status: "stale" }; // had a session cookie, but that user no longer exists in the DB

/**
 * Checks the current session and distinguishes a normal "not logged in"
 * visitor from a genuinely broken/stale session (a valid signed cookie
 * whose referenced user row no longer exists, e.g. after a database
 * reset). Only the "stale" case should prompt a sign-out + message —
 * a plain logged-out visitor should never see a session error.
 */
export async function checkSession(): Promise<SessionCheck> {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) return { status: "unauthenticated" };

  const user = await prisma.user.findUnique({ where: { id }, select: { id: true } });
  return user ? { status: "authenticated", userId: id } : { status: "stale" };
}

/** @deprecated use checkSession() instead so unauthenticated vs stale can be told apart */
export async function getValidUserId(): Promise<string | null> {
  const result = await checkSession();
  return result.status === "authenticated" ? result.userId : null;
}
