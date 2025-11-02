import type { User } from "better-auth/types";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import logger from "@/lib/logger";

/**
 * Fetches the current authenticated user from the session.
 * Returns null if no user is authenticated.
 *
 * @returns The current user object or null if not authenticated
 */
export async function getCurrentUser(): Promise<User | null> {
  logger.debug("Validating user session");

  const sessionResponse = await auth.api.getSession({
    headers: await headers(),
  });

  if (sessionResponse?.user) {
    logger.debug({ userId: sessionResponse.user.id }, "User session validated");
  } else {
    logger.debug("No active user session found");
  }

  return sessionResponse?.user ?? null;
}

/**
 * Fetches the current authenticated user from the session.
 * Throws an error if no user is authenticated.
 *
 * Use this in protected routes (e.g., dashboard pages) where the user
 * is guaranteed to exist due to layout-level authentication checks.
 *
 * @returns The current user object
 * @throws {Error} If no user is authenticated
 */
export async function getRequiredUser(): Promise<User> {
  const user = await getCurrentUser();

  if (!user) {
    logger.warn(
      "Unauthorized access attempt: user required but not authenticated",
    );
    throw new Error(
      "User is required but not authenticated. This function should only be used in protected routes.",
    );
  }

  return user;
}
