import { headers } from "next/headers";
import { auth } from "@/lib/auth";

/**
 * Fetches the current authenticated user from the session.
 * Returns null if no user is authenticated.
 *
 * @returns The current user object or null if not authenticated
 */
export async function getCurrentUser() {
  const sessionResponse = await auth.api.getSession({
    headers: await headers(),
  });

  return sessionResponse?.user ?? null;
}
