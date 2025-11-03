import { eq } from "drizzle-orm";
import { db } from "@/db";
import { userSettings } from "@/db/schema/budget";
import logger from "@/lib/logger";
import { generateId } from "@/lib/nanoid";
import { type CurrencyCode, DEFAULT_CURRENCY } from "@/lib/types/currency";

export async function getUserSettings(userId: string) {
  logger.debug({ userId }, "Fetching user settings");

  const existing = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, userId))
    .limit(1);

  if (existing.length > 0) {
    logger.info(
      { userId, currency: existing[0].currency },
      "Retrieved existing user settings",
    );
    return existing[0];
  }

  logger.info({ userId }, "Creating new user settings");
  const newSettings = await db
    .insert(userSettings)
    .values({
      id: generateId(),
      userId,
      currency: DEFAULT_CURRENCY,
    })
    .returning();

  logger.info(
    { userId, settingsId: newSettings[0].id },
    "Created new user settings",
  );
  return newSettings[0];
}

/**
 * Gets the user's currency with fallback to DEFAULT_CURRENCY
 * @param userId - The user ID
 * @returns The user's currency code or DEFAULT_CURRENCY if not set
 */
export async function getUserCurrency(userId: string): Promise<CurrencyCode> {
  const settings = await getUserSettings(userId);
  return (settings.currency || DEFAULT_CURRENCY) as CurrencyCode;
}
